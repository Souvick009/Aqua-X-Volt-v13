const serverUser = require("../../model/serverUser.js")
const Discord = require("discord.js");
const ms = require('ms');
const server = require("../../model/server.js")

const moment = require('moment')
module.exports = {
    name: "unmute",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Unmute a member so they can type or speak.",
    usage: "=unmute <user>",
    category: "Moderation",
    example: "=unmute @Real Warrior , =unmute @Yashu , =unmute @Shander ",
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links, Manage Roles, Manage Messages",
    run: async (bot, message, args) => {

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

        await message.delete().catch(error => console.log(error))

        var embed = new Discord.MessageEmbed()

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
                if (!person) return message.reply("Invalid User!");
            } catch (error) {
                if (!person) return message.reply("Invalid User!");
            }
        } else {
            if (!person) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }


        let reason = args.slice(1).join(" ")
        if (!reason) {
            reason = "none"
        }

        let muterole = message.guild.roles.cache.find(role => role.name === 'Muted');
        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")
        if (!botrole) return message.channel.send(`<@${message.author.id}>, It seems that my role isn't assigned to me, re-invite me to fix it or make a role named "Aqua X Volt" and assign it to me.`)
        if (muterole.rawPosition > botrole.rawPosition) {
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to remove a role from the user!")
            embed.setColor(0xff4a1f)
            return await message.channel.send({
                embeds: [embed]
            })

        }

        if (!muterole) return message.channel.send("Couldn't find the mute role");
        // console.log(person.roles.cache.some(r => r.name === "Muted"))

        if (!person.roles.cache.some(r => r.name === "Muted")) return message.channel.send(`<@${message.author.id}>,` + " The user is already unmuted")

        serverUser.findOne({
            serverID: message.guild.id,
            userID: person.id,

        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) {
                var newUser = new serverUser({
                    serverID: message.guild.id,
                    userID: person.id,
                })
                newUser.muteStatus = "Unmuted"

                var muteObj;

                var muteObj = {
                    administrator: message.author.tag,
                    reason: reason,
                    type: "Unmute",
                    date: Date.now(),
                    duration: 'None'
                };

                newUser.mutes.push(muteObj);
                await newUser.save().catch(e => console.log(e));
                person.roles.remove(muterole.id);
                embed.setColor(0x00FFFF)
                if (reason == "none") {
                    embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!**`);
                } else {
                    embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!** | ***${reason}***`);
                }
                message.channel.send({
                    embeds: [embed]
                })
            } else if (user) {
                if (user.muteStatus === "Unmuted" && !person.roles.cache.some(r => r.name === "Muted")) {
                    return message.channel.send(`<@${message.author.id}>,` + " The user is already unmuted")
                } else {
                    var muteObj;

                    var muteObj = {
                        administrator: message.author.tag,
                        reason: reason,
                        type: "Unmute",
                        date: Date.now(),
                        duration: 'None'
                    };

                    user.mutes.push(muteObj);
                    user.muteStatus = "Unmuted"
                    await user.save().catch(e => console.log(e));
                    person.roles.remove(muterole.id);
                    embed.setColor(0x00FFFF)
                    if (reason == "none") {
                        embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!**`);
                    } else {
                        embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!** | ***${reason}***`);
                    }
                    message.channel.send({
                        embeds: [embed]
                    })
                }
            }
        })

    }
}