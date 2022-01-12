const serverUser = require("../../model/serverUser.js")
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment')
const server = require("../../model/server.js")
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "timeout",
    aliases: [],
    accessableby: "Manage Messages, Timeout Members",
    description: "Mute a member so they cannot type or speak.",
    category: "Moderation",
    usage: "=timeout <user/userid> <limit> [reason]",
    example: "=timeout @Real Warrior 20m Abuse, =timeout @Shander 1d Emoji Spamming",
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
        if (person.permissions.has("ADMINISTRATOR")) return send(message, { content: "❌ You can not timeout an Admin. This person seems to be an Admin of this server." }, true)
        const Createdd = Date.now()

        let time = options[1];
        let reason = options[2]

        async function removeTimeOut() {
            time = null

            // console.log(time)

            if (!reason) reason = "None"

            serverUser.findOne({
                serverID: message.guild.id,
                userID: person.id,

            }, async (err, user) => {

                var muteObj = {
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
                    newUser.mutes.push(muteObj);

                    await newUser.save().catch(e => console.log(e));
                } else if (user) {
                    //if(user.muteStatus === "Muted") return message.reply("User is already muted. If you think this is a mistake then please report it to us.")

                    user.mutes.push(muteObj);

                    await user.save().catch(e => console.log(e));
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
                    console.log(error)
                })
            })
        }

        async function doTimeOut() {

            time = ms(time)

            if (!time) {
                return send(message, { content: `Invalid Time` }, true)
            }

            if (!isNaN(time)) {
                if (time < 60000) return send(message, { content: `<@${author.id}> Minimum time limit is 1 minute!` }, false)
                if (time > 604800000) return send(message, { content: `<@${author.id}> Maximum time limit is 1 week!` }, false)
                // 604800000
            }

            length = ms(time)
            // console.log(time)

            if (!reason) reason = "None"

            serverUser.findOne({
                serverID: message.guild.id,
                userID: person.id,

            }, async (err, user) => {

                var muteObj = {
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
                    newUser.mutes.push(muteObj);
                    newUser.muteStatus = "Unmuted"

                    await newUser.save().catch(e => console.log(e));
                } else if (user) {
                    //if(user.muteStatus === "Muted") return message.reply("User is already muted. If you think this is a mistake then please report it to us.")

                    user.mutes.push(muteObj);
                    user.muteStatus = "Unmuted"

                    await user.save().catch(e => console.log(e));
                }
                person.timeout(time, reason)

                const embed99 = new Discord.MessageEmbed()
                embed99.setColor(0x00FFFF)
                embed99.setDescription(`<:Bluecheckmark:754538270028726342> ***${person.user.tag} has been timeouted for ${length}*** | **${reason}** `);
                send(message, { embeds: [embed99] }, false);

                const embed420 = new Discord.MessageEmbed()
                embed420.setColor(0x00FFFF)
                embed420.setDescription(`<:Bluecheckmark:754538270028726342> ***You have been timeouted for ${length} in ${message.guild.name}*** | **${reason}**`);

                const dmUser = bot.users.cache.get(person.id)
                await dmUser.send({
                    embeds: [embed420],
                }).catch(error => {
                    console.log(error)
                })

            })
        }

        var length;
        if (time.toLowerCase() == "0" || time.toLowerCase() == "off") {
            removeTimeOut()
        } else {
            doTimeOut()
        }

        if (message.type == "DEFAULT" || message.type == "REPLY") {
            await message.delete().catch(error => console.log(error))
        }
    }
}