const serverUser = require("../../model/serverUser.js")
const Discord = require("discord.js");
const ms = require('ms');
const server = require("../../model/server.js")
const moment = require('moment')
const Utils = require("utils-discord");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "modlogs",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Shows current muted members and their remaining time.",
    category: "Moderation",
    usage: "=modlogs",
    example: "=modlogs",
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    run: async (bot, message, args, options, author) => {


        const embed = new Discord.MessageEmbed()

        serverUser.find({
            serverID: message.guild.id,
            muteStatus: "Muted"
        }, async (err, users) => {
            if (err) console.log(err);
            if (!users || users.length == 0) {
                embed.setColor(0xFF0000)
                embed.setDescription("❌ Currently No Muted Users!")
                return send(message, { embeds: [embed] }, false);

            }
            // let currentlyMuted = user.map(e => `${message.guild.members.cache.get(e.userID).user} -> ${ms(e.mutes[e.mutes.length - 1].date + e.mutes[e.mutes.length - 1].duration - Date.now(), { long: true })} Remaining`);
            await message.channel.sendTyping();
            let toSend = []
            var filteredUsers = users.filter(u => u.mutes[u.mutes.length - 1].duration !== "perm")
            if (!filteredUsers || filteredUsers.length == 0) {
                embed.setColor(0xFF0000)
                embed.setDescription("❌ Currently No Muted Users!")
                return send(message, { embeds: [embed] }, false);
            }

            // var currentMembers = filteredUsers.filter(async function(user) {
            //     var totalUsers = await message.guild.members.fetch(user.userID).catch(error => console.log(error))
            //     var current = totalUsers
            //     console.log(current)
            // })

            filteredUsers.forEach(async (user, i) => {

                var userid = await message.guild.members.fetch(user.userID).catch(error => console.log(error))
                var member;
                if (userid === undefined) {
                    member = "Invalid User"
                } else {
                    member = userid.user.tag
                }

                try {
                    var dateTime = ms(user.mutes[user.mutes.length - 1].date + user.mutes[user.mutes.length - 1].duration - Date.now(), { long: true })
                } catch (error) {
                    console.log(error)
                }

                toSend.push(`**${i + 1}. ${member}** \n Mute | Time Remaining: ${dateTime} \n`)

                // console.log(message.guild.members.fetch(user.userID))
            })
            await Utils.delay(1500);
            // console.log(toSend)
            let options2 = {
                title: "Moderation Logs",
                color: "0x39dafa",
                args: args[0],
                buttons: true,
                thumbnail: message.guild.iconURL(),
                perpage: 10
            }
            Utils.createEmbedPages(bot, message, toSend, options2, author)

        })
    }
}