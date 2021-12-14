const Discord = require("discord.js");


module.exports = {
    name: "serverinfo",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Show Useful Infomation About The Server",
    usage: "=serverinfo",
    example: "=serverinfo",
    cooldown: 5,
    category: "Info",
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    run: async (bot, message, args) => {

        var serv = message.guild

        if (serv.explicitContentFilter = `0`) {
            var eFC = "Don't Scan Any messages";
        } else {
            var eFC = serv.explicitContentFilter;
        }
        if (serv.explicitContentFilter = `1`) {
            var eFC = "Scan for users without a role.";
        } else {
            var eFC = serv.explicitContentFilter;
        }
        if (serv.explicitContentFilter = `2`) {
            var eFC = "Scan every message";
        } else {
            var eFC = serv.explicitContentFilter;
        }


        const verlvl = {
            NONE: "None",
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            VERY_HIGH: "Highest"
        }
        const afk = serv.afkChannel || 'Not Set'

        const formatDate = function (date) {
            return new Intl.DateTimeFormat('en-US').format(date)
        }

        const created = formatDate(message.guild.createdAt);

        const joined = formatDate(message.member.joinedAt);

        let inline = true
        let sicon = message.guild.iconURL();

        // await message.guild.members.fetch(message.guild.ownerID) // Fetches owner
        //     .then(guildMember => sOwner = guildMember) // sOwner is the owner

        var owner = await message.guild.fetchOwner();
        // var ownerid = message.guild.ownerId
        // var owner = message.guild.members.cache.get(ownerid);
        var roleSize = message.guild.roles.cache.size
        // if (roleSize = "") {
        //     roleSize = 0
        // }
        // console.log(owner.username)
        let serverembed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(sicon)
            .setAuthor(message.guild.name)
            .addField("__Server Name:__", message.guild.name, inline)
            .addField("__Server ID:__", message.guild.id, inline)
            .addField("__Server Owner:__", owner.user.tag, inline)
            .addField(`__AFK Channel:__`, `${afk}`, inline)
            .addField(`__AFK Timeout:__`, `${serv.afkTimeout}s`, inline)
            .addField(`__Creation of Guild:__`, `${serv.createdAt}`, inline)
            .addField(`__Explicit Content Filter Level:__`, eFC, inline)
            .addField("__Verification Level:__", `${verlvl[message.guild.verificationLevel]}`, inline)
            .addField("__Members:__", `${message.guild.memberCount}`, inline)
            .addField("__Roles:__",  message.guild.roles.cache.size.toString(), inline)
            .addField("__Text Channels:__",message.guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size.toString(), inline)
            .addField("__Voice Channels:__", message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size.toString(), inline)
            .addField("__You Joined:__", joined, inline)
            .setFooter(`Server Created: ${created}`);

        message.channel.send({ embeds: [serverembed] });
    }


}
