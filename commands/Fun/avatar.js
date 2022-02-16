const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js")

module.exports = {

    name: "avatar",
    description: "Shows avatar of a user",
    usage: "<command | alias> || <@user>",
    example: "=avatar \n =avatar @Real Warrior",
    accessableby: "Manage Messages",
    cooldown: 5,
    category: "Fun",
    aliases: ["av"],
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    options: [{
        name: "user",
        description: "For which user avatar should be sent? Defaults to author",
        required: false,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "user"
    }],
    run: async (bot, message, args, options, author) => {

        if (!message.member.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ You do not have permissions to check avatar of Server Members. Please contact a staff member.[Missing Permsission:- Manage Messages]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }


        var member = await getMember(bot, args, options, message, author, true, false, 0, false)
        if (!member) return;

        var hexes = member.displayHexColor

        let embed = new Discord.MessageEmbed()
            .setImage(member.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }))
            .setColor(hexes === '#000000' ? '#ffffff' : hexes)
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
            .setTitle("Avatar")
            .setFooter({ text: "Searched by " + author.tag, iconURL: author.displayAvatarURL() });
        send(message, {
            embeds: [embed]
        });

    }


}