const serverUser = require("../../model/serverUser.js")
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment')
const server = require("../../model/server.js")

module.exports = {
    name: "mute",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Mute a member so they cannot type or speak.",
    category: "Moderation",
    usage: "=mute <user/userid> <limit> [reason] (For Temporary Mute) \n =mute <user> <perm> [reason] (For Permanent Mute) \n ***(__If you want to mute anyone for 1h 30m use 90m and for 2h just use 2h simple!__)***",
    example: "=mute @Real Warrior perm Abuse , =mute @Yashu 10m Spamming , =mute @Shander 1d Emoji Spamming",
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links, Manage Roles, Manage Messages",
    run: async (bot, message, args) => {


        //perission code to run when it doesnt matter even if errormsg system is on/off-

        if (!message.guild.me.permissions.has(["MANAGE_ROLES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Roles]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Messages]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Manage Messages]")
            return message.channel.send({ embeds: [embed] })
        }

        //main code-


        var person;
        var mention = args[0];
        if (args[0]) {
            try {
                if (message.mentions.repliedUser) {
                    if (mention.startsWith('<@') && mention.endsWith('>')) {
                        mention = mention.slice(2, -1);

                        if (mention.startsWith('!')) {
                            mention = mention.slice(1);
                        }
                        person = await message.guild.members.fetch(mention)
                    } else {
                        person = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0]).catch(error => console.log())
                    }
                } else {
                    person = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(error => console.log())
                }
                if (!person) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!person) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else {
            if (!person) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }

        if (person.permissions.has("ADMINISTRATOR")) return message.reply("❌ You can not mute an Admin. This person seems to be an Admin of this server.")
        const Createdd = Date.now()

        let time = args[1];
        let reason = args.slice(2).join(" ")

        if (!time) return message.reply("You need to tell time");

        time = ms(time)
        if (time < 60000) return message.channel.send("Minimum time limit is 1 minute!")

        if (!time) {
            time = "perm"
            reason = args.slice(1).join(" ")
        }

        if (!reason) return message.reply("You didn't specify a reason!");


        // console.log(time)
        var muterole = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muterole) {
            try {
                message.channel.send(`Muted role is not found, Attemting to create a Muted role.`)

                let rolecreation = await message.guild.roles.create({
                    name: 'Muted',
                    reason: "For muting members",
                    permission: [{
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    }]

                });
                message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                    await channel.permissionOverwrites.create(rolecreation, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                });
                message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').forEach(async (channel, id) => {
                    await channel.permissionOverwrites.create(rolecreation, {
                        SPEAK: false
                    })
                });
                message.channel.send("The muted role has been successfully created")

            } catch (error) {
                console.log(error)
            }

        };

        var finalMuterole = await message.guild.roles.cache.find(role => role.name === 'Muted');

        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")
        if (finalMuterole.rawPosition > botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to give a role to the user!")
            embed.setColor(0xff4a1f)
            return await message.channel.send({ embeds: [embed] })
        }

        // console.log(reason)

        // if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(embed2)

        if (person.roles.cache.some(r => r.name === "Muted")) return message.channel.send(`<@${message.author.id}>, ${person.user.tag} is already muted`)
        // console.log(person.roles.cache.some(r => r.name === "Muted"))



        function doMute() {


            serverUser.findOne({
                serverID: message.guild.id,
                userID: person.id,

            }, async (err, user) => {

                var muteObj = {
                    administrator: message.author.tag,
                    reason: reason,
                    duration: time,
                    type: "Mute",
                    date: Createdd
                };

                if (err) console.log(err);
                if (!user) {
                    const newUser = new serverUser({
                        serverID: message.guild.id,
                        userID: person.id,
                    })
                    newUser.mutes.push(muteObj);
                    newUser.muteStatus = "Muted"

                    await newUser.save().catch(e => console.log(e));
                } else if (user) {
                    //if(user.muteStatus === "Muted") return message.reply("User is already muted. If you think this is a mistake then please report it to us.")

                    user.mutes.push(muteObj);
                    user.muteStatus = "Muted"

                    await user.save().catch(e => console.log(e));
                }

                // console.log(time)
                if (time === "perm") {
                    person.roles.add(message.guild.roles.cache.find(role => role.name === 'Muted'))
                    const embed3 = new Discord.MessageEmbed()
                    embed3.setColor(0x00FFFF)
                    embed3.setDescription(`<:Bluecheckmark:754538270028726342> ***${person.user.tag} has been muted permanantely*** | **${reason}** `);
                    message.channel.send({ embeds: [embed3] });
                    const embed69 = new Discord.MessageEmbed()
                    embed69.setColor(0x00FFFF)
                    embed69.setDescription(`<:Bluecheckmark:754538270028726342> ***You have been muted permanantely in ${message.guild.name}*** | **${reason}**`);
                    person.send({ embeds: [embed69] }).catch(error => console.log(error))
                } else {
                    person.roles.add(message.guild.roles.cache.find(role => role.name === 'Muted'))

                    const embed99 = new Discord.MessageEmbed()
                    embed99.setColor(0x00FFFF)
                    embed99.setDescription(`<:Bluecheckmark:754538270028726342> ***${person.user.tag} has been muted for ${ms(time)}*** | **${reason}** `);
                    message.channel.send({ embeds: [embed99] });
                    const embed420 = new Discord.MessageEmbed()
                    embed420.setColor(0x00FFFF)
                    embed420.setDescription(`<:Bluecheckmark:754538270028726342> ***You have been muted for ${ms(time)} in ${message.guild.name}*** | **${reason}**`);

                    await bot.users.cache.get(person.id).send({
                        embeds: [embed420]
                    }).catch(error => {
                        console.log(error)
                    });

                    // console.log(time)
                    setTimeout(async () => {
                        var guildMember = message.guild.members.fetch(person.id).catch(error => console.log(error))
                        if (!guildMember) {
                            serverUser.findOne({
                                serverID: message.guild.id,
                                userID: person.id,

                            }, async (err, user) => {
                                user.muteStatus = "Unmuted"
                                await user.save().catch(e => console.log(e));

                            })
                        } else {
                            var guildMember = message.guild.members.fetch(person.id).catch(error => console.log(error))
                            if (!guildMember) return
                            if (!person.roles.cache.some(r => r.name === "Muted")) {
                                serverUser.findOne({
                                    serverID: message.guild.id,
                                    userID: person.id,

                                }, async (err, user) => {
                                    user.muteStatus = "Unmuted"
                                    await user.save().catch(e => console.log(e));

                                })
                            } else {
                                try {
                                    await person.roles.remove(muterole)
                                } catch (error) {
                                    console.log(error)
                                }

                                serverUser.findOne({
                                    serverID: message.guild.id,
                                    userID: person.id,

                                }, async (err, user) => {
                                    user.muteStatus = "Unmuted"
                                    await user.save().catch(e => console.log(e));

                                })
                            }
                        }
                    }, time);
                }


            })
        }
        doMute()

        await message.delete().catch(error => console.log(error))
    }
}