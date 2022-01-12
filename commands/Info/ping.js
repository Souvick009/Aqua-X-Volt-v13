const Discord = require("discord.js");
module.exports = {

  name: "ping",
  aliases: [],
  accessableby: "MANAGE_MESSAGES",
  description: "Check ping of the bot",
  usage: "=ping",
  example: "=ping ",
  cooldown: 5,
  category: "Info",
  permission: [""],
  botreq: [],

  run: async (bot, message, args) => {
    if (message.type == "APPLICATION_COMMAND") {
      var m = await message.reply({ content: "Loading.....", fetchReply: true })
      await message.editReply(`🏓Latency is \`${Math.round(bot.ws.ping)}\`ms.`)

    } else {
      message.reply('Loading data').then(async (msg) => {
        msg.delete()
        message.reply(`🏓Latency is \`${Math.round(bot.ws.ping)}ms\`.`);
      })
    }
  }


}