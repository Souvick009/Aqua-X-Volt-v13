const Discord = require("discord.js");
const serverUser = require("../../model/serverUser.js")
const moment = require('moment')
const server = require("../../model/server.js")
const Utils = require("utils-discord");
const ms = require("ms")
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "userlogs",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Get mutes for a user.",
    usage: "=mutes <mention/userid>",
    category: "Moderation",
    example: "=mutes @Real Warrior#5085",
    cooldown: 5,
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    options: [{
        name: "user",
        description: "For which user shall I sent mutelogs?",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {

        //perission code to run when it doesnt matter even if errormsg system is on/off-


        //main code-


        //defining member who will get a mute and fetching id of him so member will be id of user mentioned
        var member = await getMember(bot, args, options, message, author, false, false, 0, false)
        if (!member) return;
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
                return send(message, {
                    embeds: [RichEmbed]
                }, false)
            } else if (user) {

                let mutes = user.mutes;
                mutes.reverse()
                let toSend = {
                    "mutes": [],
                    "timeouts": []
                }
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
                        toSend.mutes.push(`\`${i + 1}\` **Type: ${mute.type}** \n **Moderator: ${mute.administrator}** \n ${mute.reason} - ${moment(mute.date).format('LT, LL')} - ${time} \n`)
                    } else {
                        toSend.mutes.push(`\`${i + 1}\` **Moderator: ${mute.administrator}** \n ${mute.reason} - ${moment(mute.date).format('LT, LL')} - ${time} \n`)
                    }
                })
                let timeouts = user.timeouts
                timeouts.reverse()
                timeouts.forEach((timeout, i) => {
                    // var timeoutObj = {
                    //     administrator: author.tag,
                    //     reason: reason,
                    //     duration: time,
                    //     type: "Added Timeout",
                    //     date: Createdd
                    // };

                    // toSend.push(`\`${i + 1}\` ** Moderator: ${mute.administrator}** \n ${mute.reason} - ${moment(mute.date).format('LT, LL')} - ${ms(mute.duration)} - ${mute.type}`)
                    var time;
                    if (timeout.duration === "None") time = "None"
                    else time = ms(timeout.duration)



                    toSend.timeouts.push(`\`${i + 1}\` **Type: ${timeout.type}** \n **Moderator: ${timeout.administrator}** \n ${timeout.reason} - ${moment(timeout.date).format('LT, LL')} - ${time} \n`)
                })


                if (mutes.length < 1) mutes.push("No mutes!")
                let options2 = {
                    author: `Userinfo of ${member.user.tag} (${member.user.id})`,
                    color: "0x39dafa",
                    args: args[0],
                    buttons: true,
                    thumbnail: message.guild.iconURL(),
                    perpage: 10,
                    authorImage: member.user.displayAvatarURL()
                }
                Utils.createEmbedPages(bot, message, toSend, options2, true)

            }
        })
    }
}