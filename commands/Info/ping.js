const Discord = require("discord.js");
const PREFIX = '=';
module.exports = {
  name: "ping",
  aliases: [],
  accessableby: "Manage Messages",
  description: "Check ping of the bot",
  usage: "=ping",
  example: "=ping ",
  cooldown: 5,
  category: "Info",
  permission: [""],
  botreq : "",
  run: async (bot, message, args) => {
    if (!message.guild.me.permissions.has(["SEND_MESSAGES"])) return
    
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return

    message.channel.send('Loading data').then(async (msg) => {
      msg.delete().catch(error => console.log(error))
      message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`);
    })
  }


}