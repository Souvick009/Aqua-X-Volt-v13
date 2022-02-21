const serverUser = require("../../model/serverUser.js")
const Discord = require("discord.js");
const ms = require('ms');
const Utils = require("utils-discord");
const send = require("../../utils/sendMessage.js")

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
        var count = 0
        const embed = new Discord.MessageEmbed()

        let toSend = []

        async function both(user) {
            if (user.mutes[user.mutes.length - 1].duration !== "perm") {

                var userid = await message.guild.members.fetch(user.userID).catch(error => console.log(error))
                var member;
                if (userid === undefined) {
                    member = "Invalid User"
                } else {
                    member = userid.user.tag
                }

                var type;
                try {
                    var dateTime = ms(user.mutes[user.mutes.length - 1].date + user.mutes[user.mutes.length - 1].duration - Date.now(), {
                        long: true
                    })
                    if (userid !== undefined) {
                        var dateTime2 = ms(userid.communicationDisabledUntil - Date.now(), {
                            long: true
                        })
                    }
                    type = "Mute & Timeout"
                } catch (error) {
                    console.log(error)
                }

                if (userid === undefined) {
                    toSend.push(`${member}** \n ${type} | Time Remaining: ${dateTime} \n`)
                } else {
                    toSend.push(`${member}** \n ${type} | Time Remaining: ${dateTime} (Mute) | Time Remaining: ${dateTime2} (Timeout) \n`)
                }
                // console.log(message.guild.members.fetch(user.userID))
            }

        }


        async function mute(user) {
            if (user.mutes[user.mutes.length - 1].duration !== "perm") {

                count++

                var userid = await message.guild.members.fetch(user.userID).catch(error => console.log(error))
                var member;
                if (userid === undefined) {
                    member = "Invalid User"
                } else {
                    member = userid.user.tag
                }

                var type;
                try {
                    var dateTime = ms(user.mutes[user.mutes.length - 1].date + user.mutes[user.mutes.length - 1].duration - Date.now(), {
                        long: true
                    })
                    type = "Mute"
                } catch (error) {
                    console.log(error)
                }

                toSend.push(`${member}** \n ${type} | Time Remaining: ${dateTime} \n`)
            }


        }

        async function timeout(user) {

            var userid = await message.guild.members.fetch(user.userID).catch(error => console.log(error))
            var member;
            if (userid === undefined) {
                member = "Invalid User (Member Left)"
            } else {
                member = userid.user.tag
            }

            var type;
            try {
                if (userid !== undefined) {
                    var dateTime = ms(userid.communicationDisabledUntil - Date.now(), {
                        long: true
                    })
                } else {
                    var dateTime = ms(user.timeouts[user.timeouts.length - 1].duration + user.timeouts[user.timeouts.length - 1].date - Date.now(), {
                        long: true
                    })
                }
                type = "Timeout"
            } catch (error) {
                console.log(error)
            }


            toSend.push(`${member}** \n ${type} | Time Remaining: ${dateTime} \n`)
            // console.log(message.guild.members.fetch(user.userID))

        }

        await message.channel.sendTyping();

        serverUser.find({
            serverID: message.guild.id,
        }, async (err, users) => {
            if (err) console.log(err);
            for (let i = 0; i < users.length; i++) {
                if (users[i].muteStatus === "Unmuted" && users[i].timeoutStatus === "Timedout") {
                    await timeout(users[i]);
                    count++
                }
                if (users[i].muteStatus === "Muted" && users[i].timeoutStatus === "") {
                    await mute(users[i]);
                }
                if (users[i].muteStatus === "Muted" && users[i].timeoutStatus === "Timedout") {
                    await both(users[i]);
                    count++
                }
            }

            if (count === toSend.length) {
                if (toSend.length === 0) {
                    embed.setColor(0xFF0000)
                    embed.setDescription("❌ Currently No Muted/Timeouted Users!")
                    return send(message, {
                        embeds: [embed]
                    }, false);
                }
                toSend.forEach((val, i) => {
                    toSend[i] = `**${i + 1}. ${toSend[i]}`

                })

                let options2 = {
                    title: "Moderation Logs",
                    color: "0x39dafa",
                    args: args[0],
                    buttons: true,
                    thumbnail: message.guild.iconURL(),
                    perpage: 10
                }
                Utils.createEmbedPages(bot, message, toSend, options2, false)
            }
        })

    }
}