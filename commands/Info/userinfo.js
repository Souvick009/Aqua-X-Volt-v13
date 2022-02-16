const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {

    name: "userinfo",
    aliases: ["whois"],
    accessableby: "MANAGE_MESSAGES",
    description: "Returns user information",
    category: "Info",
    usage: "=userinfo <mention>",
    example: "=userinfo @Real Warrior#5085",
    permission: ["MANAGE_MESSAGES"],
    botreq: ["EMBED_LINKS"],
    options: [{
        name: "user",
        description: "For which user you want the information?",
        required: false,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {

        var member = await getMember(bot, args, options, message, author, true, false, 0, false)
        // const member = await message.guild.members.fetch(member1.id).catch(error => console.log())
        if (!member) return;


        // Member variables
        const formatDate = function (date) {
            return new Intl.DateTimeFormat('en-US').format(date)
        }
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setFooter({ text: "Searched by " + author.username, iconURL: author.displayAvatarURL() })
            .setThumbnail(member.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }))
            .setColor(member.displayHexColor === '#000000' ? 'RANDOM' : member.displayHexColor)

            .addField('Member information:', stripIndents`**> Display name:** ${member.displayName}
                **> Joined at:** ${joined}
                **> Roles:** ${roles}`, true)

            .addField('User information:', stripIndents`**> ID:** ${member.user.id}
                **> Username:** ${member.user.username}
                **> Tag:** ${member.user.tag}
                **> Created at:** ${created}`, true)

            .setTimestamp()
        send(message, { embeds: [embed] });

    }
}
