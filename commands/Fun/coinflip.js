const send = require("../../utils/sendMessage.js")

module.exports = {
    name: "coinflip",
    aliases: ["flip"],
    description: "Simple Coinflip Game or You Can Call This Head or Tail Game",
    usage: "=coinflip",
    accessableby: "Anyone",
    category: "Fun",
    example: "=coinflip",
    permission: [""],
    botreq: "",
    run: async (bot, message, args, author, options) => {

        var choices = [
            "heads",
            "tails"
        ];

        var output = choices[Math.floor(Math.random() * choices.length)];

        send(message, { content: `You got **${output}**` }
        );

    }


}