const Discord = require("discord.js");

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
    botreq: "Embed Links",
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has(["SEND_MESSAGES"])) return

        if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return

        if (!message.guild.me.permissions.has(["EMBED_LINKS"])) return message.channel.send("❌ I don't have Embed Links permission!")

        let days = Math.floor(bot.uptime / 86400000);
        let hours = Math.floor(bot.uptime / 3600000) % 24;
        let minutes = Math.floor(bot.uptime / 60000) % 60;
        let seconds = Math.floor(bot.uptime / 1000) % 60;

        // message.channel.send(`__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s`);

        const embed = new Discord.MessageEmbed()
            .setColor(0xe8fc03)
            .setAuthor(`Information About AQUA X VOLT`, bot.user.displayAvatarURL())
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setDescription(`AQUA X VOLT`)
            .addField(`:crown: __Creator/Owner__`, "!—͟͟͞✮〢Real Warrior ☆OP☆#5085")
            .addField(`:tools: __Developer Team__`, ":first_place: !—͟͟͞✮〢Real Warrior ☆OP☆#5085\n:second_place: Shander#4911")
            .addField(`:gear: __Version__`, "Version 3.2.8")
            .addField(`⏰ __Uptime__`, `\`${days}\` Days \`${hours}\` Hrs \`${minutes}\` Mins \`${seconds}\` Secs`)
            .addField(`Want To Invite Me In Your Server?`, "[Invite Me](https://discord.com/oauth2/authorize?client_id=721460877005422634&scope=bot&permissions=470117462)")
            .addField(`Want To Report Something?`, "[Join our support server](https://discord.gg/6KxtUQ3wmf)")
            .setFooter(message.author.username, message.author.displayAvatarURL())
        message.channel.send({ embeds: [embed] })
    }


}