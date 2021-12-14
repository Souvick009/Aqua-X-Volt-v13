const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "userinfo",
    aliases: ["whois"],
    accessableby: "Manage Messages",
    description: "Returns user information",
    category: "Info",
    usage: "=userinfo <mention>",
    example: "=userinfo @Real Warrior#5085", 
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    run: async (client, message, args) => {

        if (!message.guild.me.permissions.has(["SEND_MESSAGES"])) return

        if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return

        if (!message.guild.me.permissions.has(["EMBED_LINKS"])) return message.channel.send("❌ I don't have Embed Links permission!")

        if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send("❌ I don't have Embed Links permission in this channel!")

        if (!message.member.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ You do not have permissions to Manage Messages members. Please contact a staff member.[Missing Permission:- Manage Messages]")
            return message.channel.send({ embeds: [embed] })
        }

        const getMember = function (message, toFind = '') {
            toFind = toFind.toLowerCase();

            let target = message.guild.members.cache.get(toFind);

            if (!target && message.mentions.members)
                target = message.mentions.members.first();

            if (!target && toFind) {
                target = message.guild.members.cache.find(member => {
                    return member.displayName.toLowerCase().includes(toFind) ||
                        member.user.tag.toLowerCase().includes(toFind)
                });
            }

            if (!target)
                target = message.member;

            return target;
        };

        const member = getMember(message, args.join(" "));

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
            .setFooter("Searched by " + message.author.username, message.author.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(member.displayHexColor === '#000000' ? 'RANDOM' : member.displayHexColor)

            .addField('Member information:', stripIndents`**> Display name:** ${member.displayName}
                **> Joined at:** ${joined}
                **> Roles:** ${roles}`, true)

            .addField('User information:', stripIndents`**> ID:** ${member.user.id}
                **> Username:** ${member.user.username}
                **> Tag:** ${member.user.tag}
                **> Created at:** ${created}`, true)

            .setTimestamp()
        message.channel.send({ embeds: [embed] });

    }
}
