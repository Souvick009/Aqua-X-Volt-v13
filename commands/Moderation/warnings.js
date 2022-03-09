const Discord = require("discord.js");
const serverUser = require("../../model/serverUser.js")
const moment = require('moment')
const Utils = require("utils-discord");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

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
    options: [{
        name: "user",
        description: "For which command should I send information for?",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {

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

        const embed = new Discord.MessageEmbed()

        //permissions ka code

        //defining member who will get a warn and fetching id of him so member will be id of user mentioned
        var member = await getMember(bot, args, options, message, author, false, false, 0, false)

        if (!member) return

        //storing data in db according to total warns, member warned, guild id

        serverUser.findOne({
            serverID: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user || user.warns.length == 0) {
                embed.setColor(0xFF0000)
                embed.setDescription("❌ No Warnings!")
                return send(message, {
                    embeds: [embed]
                }, false);
            } else if (user) {

                let warnings = user.warns;

                let toSend = []
                warnings.forEach((warn, i) => {
                    toSend.push(`\`${i + 1}\` **Moderator: ${warn.administrator}** \n ${warn.reason} - ${moment(new Date(warn.date)).format('LT, LL')} \n`)
                })
                toSend.unshift(`**Total Warnings Recived: ${warnings.length}** \n -------------------------------------------- \n **Warnings:**`)
                if (warnings.length < 1) warnings.push("No warnings!")


                // embed.setAuthor(`Warning Stats for ${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL)
                // embed.setColor(0x39dafa)
                // embed.setDescription(`**Total Warnings Recived: ${warnings.length}** \n -------------------------------------------- \n **Warnings:** \n ${toSend.join("\n \n")}`)
                // embed.setTimestamp()
                // embed.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL })
                // message.channel.send({embeds: [embed]});
                var input = options[0]

                let options2 = {
                    color: "#1d47c4",
                    args: input,
                    buttons: true,
                    thumbnail: message.guild.iconURL(),
                    perpage: 11,
                    author: `Warning Stats for ${member.user.tag} (${member.user.id})`,
                    authorImage: member.user.displayAvatarURL()
                }
                Utils.createEmbedPages(bot, message, toSend, options2)
            }
        })

    }
}
