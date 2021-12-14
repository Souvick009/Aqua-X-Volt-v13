const Discord = require("discord.js");


module.exports = {
  name: "coinflip",
  aliases: ["flip"],
  description: "Simple Coinflip Game or You Can Call This Head or Tail Game",
  usage: "<command | alias>",
  accessableby: "Anyone",
  category: "Fun",
  example: "=coinflip",
  permission: [""],
  botreq: "",
  run: async (bot, message, args) => {

    if (!message.guild.me.permissions.has(["SEND_MESSAGES"])) return

    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
    
    var choices = [
      "heads",
      "tails"
    ];

    var output = choices[Math.floor(Math.random() * choices.length)];

    message.channel.send(`You got **${output}**`)

  }


}