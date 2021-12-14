const Discord = require("discord.js");
const serverUser = require("../../model/serverUser.js")
const moment = require('moment')
const server = require("../../model/server.js")

const Utils = require("utils-discord");
const ms = require("ms")
module.exports = {
    name: "mutelogs",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Get mutes for a user.",
    usage: "=mutes <mention/userid>",
    category: "Moderation",
    example: "=mutes @Real Warrior#5085",
    cooldown: 5,
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    run: async (bot, message, args) => {

        //perission code to run when it doesnt matter even if errormsg system is on/off-


        //main code-


        //defining member who will get a mute and fetching id of him so member will be id of user mentioned
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
                if (!member) return message.reply("Invalid User!");
            } catch (error) {
                if (!member) return message.reply("Invalid User!");
            }
        } else {
            if (!member) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }
        //storing data in db according to total mutes, member muteed, guild id

        serverUser.findOne({
            serverID: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user || user.mutes.length == 0) {
                const RichEmbed = new Discord.MessageEmbed()
                RichEmbed.setColor(0xFF0000)
                RichEmbed.setDescription("❌ No mutes!")
                return message.channel.send({ embeds: [RichEmbed] })
            } else if (user) {

                let mutes = user.mutes;

                let toSend = []
                mutes.forEach((mute, i) => {
                    // toSend.push(`\`${i + 1}\` ** Moderator: ${mute.administrator}** \n ${mute.reason} - ${moment(mute.date).format('LT, LL')} - ${ms(mute.duration)} - ${mute.type}`)
                    var time;
                    if (mute.duration !== "perm") {
                        if (mute.duration === "None") {
                            time = "None"
                        } else {
                            time = ms(mute.duration)
                        }
                    } else if (mute.duration === "perm") {
                        time = "Permanent"
                    }

                    if (mute.type) {
                        toSend.push(`\`${i + 1}\` **Type: ${mute.type}** \n **Moderator: ${mute.administrator}** \n ${mute.reason} - ${moment(mute.date).format('LT, LL')} - ${time} \n`)
                    } else {
                        toSend.push(`\`${i + 1}\` **Moderator: ${mute.administrator}** \n ${mute.reason} - ${moment(mute.date).format('LT, LL')} - ${time} \n`)
                    }
                })

                toSend.unshift(`**Total Mutes Recived: ${mutes.length}** \n -------------------------------------------- \n **Logs:**`)

                if (mutes.length < 1) mutes.push("No mutes!")
                let options = {
                    title: `MuteLogs of ${member.user.tag} (${member.user.id})`,
                    color: "0x39dafa",
                    args: args[0],
                    buttons: true,
                    thumbnail: message.guild.iconURL(),
                    perpage: 10
                }
                Utils.createEmbedPages(bot, message, toSend, options)

            }
        })
    }
}