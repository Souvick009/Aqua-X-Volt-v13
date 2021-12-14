const Discord = require("discord.js");

module.exports = {
    name: "invite",
    aliases: [],
    accessableby: "everyone",
    description: "Provides invite link of the bot",
    usage: "=invite",
    example: "=invite",
    cooldown: 5,
    category: "Info",
    permission: [""],
    botreq: "",
    run: async (bot, message, args) => {

        message.reply({ content: `https://discord.com/api/oauth2/authorize?client_id=721460877005422634&permissions=414397754615&scope=bot` })

    }


}