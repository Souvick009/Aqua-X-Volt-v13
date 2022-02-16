const Discord = require("discord.js");
const ms = require('ms');
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "ban",
    aliases: [],
    accessableby: "Ban Members",
    description: "bans a member from the server!",
    usage: "=ban <user/userid> [Reason]",
    example: "=ban @Real Warrior Abuse , =ban @Yashu Simping , =ban @Shander",
    category: "Moderation",
    permission: ["BAN_MEMBERS"],
    botreq: "Embed Links, Ban Members, Manage Message",
    options: [{
        name: "user",
        description: "For which command should I send information for?",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    },
    {
        name: "reason",
        description: "Reason that why the user is getting banned",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }
    ],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has(["BAN_MEMBERS"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Ban Members]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Messages]")
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

        var embed = new Discord.MessageEmbed()

        var member = await getMember(bot, args, options, message, author, false, false, 0, true)

        if (member) {
            const guildMember = message.guild.members.cache.get(member.id);
            if (guildMember) {
                if (member.permissions.has("ADMINISTRATOR")) {
                    embed.setColor(0xFF0000)
                    embed.setDescription("❌ You can not ban an Admin.This person seems to be an Admin of this server.")
                    return send(message, {
                        embeds: [embed],
                        ephemeral: true
                    })
                }
            }
        }
        //defining member who will get a warn and fetching id of him so member will be id of user mentioned


        let reason = options[1]
        var input = options[0]

        if (!reason) {
            reason = "None"
        }


        async function sendDm() {
            const msg = "You got banned from " + message.guild.name + "\n" + "By: " + author.username + "\n" + "Reason: " + reason
            embed.setColor(0x00FFFF)
            embed.setThumbnail(bot.user.displayAvatarURL())
            embed.setDescription(msg);
            embed.setFooter({ text: author.tag, iconURL: author.displayAvatarURL() })
            embed.setTimestamp()
            var mentionedUser = bot.users.cache.get(member.id)
            await mentionedUser.send({
                embeds: [embed],
            }).catch(error => {
                console.log(error)
            })

        }




        async function guildmemberBan() {
            const guildMember = message.guild.members.cache.get(member.id);
            var fetchBans = await message.guild.bans.fetch();
            var currentBan = fetchBans.get(member.id)
            if (currentBan) return message.channel.send(`<@${author.id}>, This user is already banned from the server`)

            await message.guild.bans.create(member, {
                reason: reason
            }).then((user) => {
                {
                    var embed1 = new Discord.MessageEmbed()
                    embed1.setColor(0x00FFFF)
                    if (guildMember) {
                        embed1.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Banned ${user.user.username}*** | **${reason}**`)
                    } else {
                        embed1.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Banned ${user.username}#${user.discriminator}*** | **${reason}**`)
                    }

                    return send(message, {
                        embeds: [embed1]
                    })
                }

            }).catch(err => {
                send(message, { content: 'I was unable to ban the member' });
                console.log(err);
            });
        }

        async function guildBan() {
            if (isNaN(input)) return send(message, { content: `Either the user is not present in the server or the user doesn't exist on the discord, try to use the user id instead` }
                , false)
            var fetchBans = await message.guild.bans.fetch();
            // console.log(input)
            var currentBan = fetchBans.get(input)

            if (currentBan) return send(message, { content: `This user is already banned from the server` }
                , false)

            await message.guild.bans.create(input).then((user) => {
                {
                    var embed1 = new Discord.MessageEmbed()
                    embed1.setColor(0x00FFFF)
                    embed1.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Banned ${user.username}#${user.discriminator}*** | **${reason}**`)
                    return send(message, {
                        embeds: [embed1]
                    }, false)
                }

            }).catch(err => {
                send(message, { content: 'I was unable to ban the member' }
                    , false);
                console.log(err);
            });
        }

        if (message.type == "DEFAULT" || message.type == "REPLY") {
            await message.delete().catch(error => console.log(error))
        }

        if (member) {
            const guildMember = message.guild.members.cache.get(member.id);
            if (guildMember) {
                sendDm()
                setTimeout(guildmemberBan, 1000)
            } else {
                setTimeout(guildmemberBan, 1000)
            }
        } else {
            guildBan()
        }

        // if (guildMember) {
        //     setTimeout(secureBan, 1000)
        // } else {
        //     setTimeout(secureBan, 1000)
        // }

    }
}