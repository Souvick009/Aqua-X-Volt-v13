const serverUser = require("../../model/serverUser.js")
const Discord = require("discord.js");
const ms = require('ms');
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "timeout",
    aliases: [],
    accessableby: "Manage Messages, Timeout Members",
    description: "Mute a member so they cannot type or speak.",
    category: "Moderation",
    usage: "=timeout <user/userid> <limit> [reason] (For Removing the timeout just replace <limit> with 0)",
    example: "=timeout @Real Warrior 20m Abuse, =timeout @Shander 1d Emoji Spamming, =timeout @Real Warrior 0 He won't do it again",
    permission: ["MODERATE_MEMBERS"],
    botreq: "Embed Links, Timeout Members, Manage Messages",
    options: [{
        name: "user",
        description: "For which command should I send information for?",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "time",
        description: "For which command should I send information for?",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "reason",
        description: "For which command should I send information for?",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }],
    run: async (bot, message, args, options, author) => {

        //perission code to run when it doesnt matter even if errormsg system is on/off-

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Messages]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.guild.me.permissions.has(["MODERATE_MEMBERS"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Timeout Members]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Manage Messages]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        //main code-


        var person = await getMember(bot, args, options, message, author, false, false, 0, false)
        // var person = await message.guild.members.fetch(person1.id).catch(error => console.log())
        if (!person) return;
        if (person.id == "721460877005422634") return send(message, { content: "You can't timeout me" }, true)
        if (person.permissions.has("ADMINISTRATOR")) return send(message, { content: "❌ You can not timeout an Admin. This person seems to be an Admin of this server." }, true)
        if (person.id == author.id) return send(message, { content: "You can't timeout yourself" }, true)

        var userRole = await person.roles.highest

        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")
        
        if (!botrole) {
            return send(message, {
                content: "Can't find my role with the name `Aqua X Volt`, Please re-create a role with my name and don't edit my role name.",
                ephemeral: true,
            }, true)
        }

        if (userRole.rawPosition >= botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to moderate the user!")
            embed.setColor(0xff4a1f)
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, false)
        }

        const Createdd = Date.now()

        let time = options[1];
        let reason = options[2]

        async function removeTimeOut() {
            time = null

            // console.log(time)

            if (!reason) reason = "None"

            if (!person.isCommunicationDisabled()) return send(message, { content: `That user is not timedout` }, true)

            serverUser.findOne({
                serverID: message.guild.id,
                userID: person.id,

            }, async (err, user) => {

                var timeoutObj = {
                    administrator: author.tag,
                    reason: reason,
                    duration: "None",
                    type: "Removed Timeout",
                    date: Createdd
                };

                if (err) console.log(err);
                if (!user) {
                    const newUser = new serverUser({
                        serverID: message.guild.id,
                        userID: person.id,
                    })
                    newUser.timeouts.push(timeoutObj);
                    newUser.timeoutStatus = ""

                    await newUser.save().catch(e => console.log(e));
                } else if (user) {
                    //if(user.muteStatus === "Muted") return message.reply("User is already muted. If you think this is a mistake then please report it to us.")

                    user.timeouts.push(timeoutObj);
                    user.timeoutStatus = ""
                    await user.save().catch(e => console.log(e));
                }

                if (message.type !== "APPLICATION_COMMAND") {
                    await message.delete().catch(error => console.log(error))
                }

                person.timeout(time, reason)

                const embed99 = new Discord.MessageEmbed()
                embed99.setColor(0x00FFFF)
                embed99.setDescription(`<:Bluecheckmark:754538270028726342> ***The timeout has been removed from ${person.user.tag}*** | **${reason}** `);
                send(message, { embeds: [embed99] }, false);

                const embed420 = new Discord.MessageEmbed()
                embed420.setColor(0x00FFFF)
                embed420.setDescription(`<:Bluecheckmark:754538270028726342> ***Your timeout has been removed from ${person.user.tag}*** | **${reason}** `);

                const dmUser = bot.users.cache.get(person.id)
                await dmUser.send({
                    embeds: [embed420],
                }).catch(error => {
                    if (error.code === 50007) {
                        return
                    } else {
                        console.log(error);
                    }
                })
            })
        }

        async function doTimeOut() {

            time = ms(time)

            if (!time) {
                return send(message, { content: `Invalid Time` }, false)
            }

            if (!isNaN(time)) {
                if (time < 60000) {
                    return send(message, { content: `<@${author.id}> Minimum time limit is 1 minute!` }, true)
                }
                if (time > 604800000) {
                    return send(message, { content: `<@${author.id}> Maximum time limit is 1 week!` }, true)
                }
                // 604800000
            }

            if (person.isCommunicationDisabled()) {
                return send(message, { content: `This user is already timed out` }, true)
            }
            length = ms(time)
            // console.log(time)

            if (!reason) reason = "None"

            serverUser.findOne({
                serverID: message.guild.id,
                userID: person.id,

            }, async (err, user) => {

                var timeoutObj = {
                    administrator: author.tag,
                    reason: reason,
                    duration: time,
                    type: "Added Timeout",
                    date: Createdd
                };

                if (err) console.log(err);
                if (!user) {
                    const newUser = new serverUser({
                        serverID: message.guild.id,
                        userID: person.id,
                    })
                    newUser.timeouts.push(timeoutObj);
                    newUser.timeoutStatus = "Timedout"

                    await newUser.save().catch(e => console.log(e));
                } else if (user) {
                    //if(user.muteStatus === "Muted") return message.reply("User is already muted. If you think this is a mistake then please report it to us.")

                    user.timeouts.push(timeoutObj);
                    user.timeoutStatus = "Timedout"

                    await user.save().catch(e => console.log(e));
                }

                if (message.type !== "APPLICATION_COMMAND") {
                    await message.delete().catch(error => console.log(error))
                }

                person.timeout(time, reason)

                const embed99 = new Discord.MessageEmbed()
                embed99.setColor(0x00FFFF)
                embed99.setDescription(`<:Bluecheckmark:754538270028726342> ***${person.user.tag} has been timed out for ${length}*** | **${reason}** `);
                send(message, { embeds: [embed99] }, false);

                const embed420 = new Discord.MessageEmbed()
                embed420.setColor(0x00FFFF)
                embed420.setDescription(`<:Bluecheckmark:754538270028726342> ***You have been timed out for ${length} in ${message.guild.name}*** | **${reason}**`);

                setTimeout(async () => {
                    var guildMember
                    try {
                        guildMember = await message.guild.members.fetch(person.id).catch(error => console.log(error))
                    } catch (error) {
                        guildMember = null
                    }
                    if (!guildMember) {
                        serverUser.findOne({
                            serverID: message.guild.id,
                            userID: person.id,
                        }, async (err, user) => {
                            if (user.timeoutStatus == "Timedout") {
                                user.timeoutStatus = ""
                            }
                            await user.save().catch(e => console.log(e));

                        })
                    } else {
                        if (guildMember.isCommunicationDisabled()) {
                            return
                        }
                        serverUser.findOne({
                            serverID: message.guild.id,
                            userID: guildMember.id,
                        }, async (err, user) => {
                            if (user.timeoutStatus == "Timedout") {
                                user.timeoutStatus = ""
                            }
                            await user.save().catch(e => console.log(e));

                        })
                    }
                }, time);

                const dmUser = bot.users.cache.get(person.id)
                await dmUser.send({
                    embeds: [embed420],
                }).catch(error => {
                    if (error.code === 50007) {
                        return
                    } else {
                        console.log(error);
                    }
                })
            })
        }

        var length;
        if (time) {
            if (time.toLowerCase() == "0" || time.toLowerCase() == "off") {
                removeTimeOut()
            } else {
                doTimeOut()
            }
        } else {
            return send(message, { content: `You need to specify the time!` }, true)
        }
    }
}