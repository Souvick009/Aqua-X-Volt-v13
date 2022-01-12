const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
module.exports = {

    name: "info",
    aliases: ["botinfo"],
    description: "Returns info about AquaXVolt bot",
    usage: "<command | alias>",
    example: "=info",
    accessableby: "Anyone",
    cooldown: 5,
    category: "Info",
    permission: [""],
    botreq: ["EMBED_LINKS"],

    run: async (bot, message, args, options, author) => {

        let days = Math.floor(bot.uptime / 86400000);
        let hours = Math.floor(bot.uptime / 3600000) % 24;
        let minutes = Math.floor(bot.uptime / 60000) % 60;
        let seconds = Math.floor(bot.uptime / 1000) % 60;

        // message.channel.send(`__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s`);

        const embed = new Discord.MessageEmbed()
            .setColor(0xe8fc03)
            .setAuthor({ name: `Information About AQUA X VOLT`, iconURL: bot.user.displayAvatarURL() })
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setDescription(`AQUA X VOLT`)
            .addField(`:crown: __Creator/Owner__`, "!—͟͟͞✮〢Real Warrior ☆OP☆#0009")
            .addField(`:tools: __Developer Team__`, ":first_place: !—͟͟͞✮〢Real Warrior ☆OP☆#0009\n:second_place: Shander#4911")
            .addField(`:gear: __Version__`, "Version 3.3.5")
            .addField(`⏰ __Uptime__`, `\`${days}\` Days \`${hours}\` Hrs \`${minutes}\` Mins \`${seconds}\` Secs`)
            .addField(`Want To Invite Me In Your Server?`, "[Invite Me](https://discord.com/api/oauth2/authorize?client_id=721460877005422634&permissions=1392039259222&scope=bot%20applications.commands)")
            .addField(`Want To Report Something?`, "[Join our support server](https://discord.gg/6KxtUQ3wmf)")
            .setFooter({ text: author.username, iconURL: author.displayAvatarURL() })
        send(message, { embeds: [embed] }, false)
    }


}