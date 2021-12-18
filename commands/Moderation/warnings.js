const Discord = require("discord.js");
const serverUser = require("../../model/serverUser.js")
const moment = require('moment')
const server = require("../../model/server.js")
const Utils = require("utils-discord");

module.exports = {
    name: "warnings",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Get warnings for a user.",
    usage: "=warnings <mention/userid>",
    category: "Moderation",
    example: "=warnings @Real Warrior",
    cooldown: 5,
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    run: async (bot, message, args) => {

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

        const embed = new Discord.MessageEmbed()

        //permissions ka code

        //defining member who will get a warn and fetching id of him so member will be id of user mentioned
        var member;
        var mention = args[0];
        if (args[0]) {
            try {
                if (message.mentions.repliedUser) {
                    if (mention.startsWith('<@') && mention.endsWith('>')) {
                        mention = mention.slice(2, -1);

                        if (mention.startsWith('!')) {
                            mention = mention.slice(1);
                        }
                        member = await message.guild.members.fetch(mention)
                    } else {
                        member = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0]).catch(error => console.log())
                    }
                } else {
                    member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(error => console.log())
                }
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else {
            if (!member) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }
        //storing data in db according to total warns, member warned, guild id

        serverUser.findOne({
            serverID: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user || user.warns.length == 0) {
                embed.setColor(0xFF0000)
                embed.setDescription("❌ No Warnings!")
                return message.channel.send({
                    embeds: [embed]
                });
            } else if (user) {

                let warnings = user.warns;

                let toSend = []
                warnings.forEach((warn, i) => {
                    toSend.push(`\`${i + 1}\` **ID: ${warn.id} | Moderator: ${warn.administrator}** \n ${warn.reason} - ${moment(warn.date).format('LT, LL')} \n`)
                })
                toSend.unshift(`**Total Warnings Recived: ${warnings.length}** \n -------------------------------------------- \n **Warnings:**`)
                if (warnings.length < 1) warnings.push("No warnings!")


                // embed.setAuthor(`Warning Stats for ${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL)
                // embed.setColor(0x39dafa)
                // embed.setDescription(`**Total Warnings Recived: ${warnings.length}** \n -------------------------------------------- \n **Warnings:** \n ${toSend.join("\n \n")}`)
                // embed.setTimestamp()
                // embed.setFooter(message.author.username, message.author.displayAvatarURL)
                // message.channel.send({embeds: [embed]});

                let options = {
                    color: "0x39dafa",
                    args: args[0],
                    buttons: true,
                    thumbnail: message.guild.iconURL(),
                    perpage: 11,
                    author: `Warning Stats for ${member.user.tag} (${member.user.id})`
                }
                Utils.createEmbedPages(bot, message, toSend, options)
            }
        })

    }
}