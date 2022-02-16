const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")

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
    botreq: [],

    run: async (bot, message, args) => {

        send(message, { content: `https://discord.com/api/oauth2/authorize?client_id=721460877005422634&permissions=1392039259222&scope=bot%20applications.commands` }, true)

    }
}