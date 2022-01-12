const Discord = require("discord.js");
const chooseArr = ["🗻", "📰", "✂"];
const send = require("../../utils/sendMessage.js")

module.exports = {
    name: "rps",
    aliases: ["rps"],
    description: "Simple Rock Paper Scissors Game. React to one of the emojis to play the game.",
    usage: "<command | alias>",
    category: "Fun",
    example: "=rps",
    accessableby: "Anyone",
    permission: [""],
    botreq: "Embed Links, Manage Messages, Add Reactions",
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            const embed1 = new Discord.MessageEmbed()
            embed1.setColor(0xFF0000)
            embed1.setDescription("Check My Permissions.[Missing Permissions:- MANAGE MESSAGES]")
            return send(message, {
                embeds: [embed1],
                ephemeral: true
            }, true)
        }

        if (!message.guild.me.permissions.has("ADD_REACTIONS")) {
            const embed2 = new Discord.MessageEmbed()
            embed2.setColor(0xFF0000)
            embed2.setDescription("Check My Permissions.[Missing Permissions:- ADD REACTIONS]")
            return send(message, {
                embeds: [embed2],
                ephemeral: true
            }, true)
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const noperm1 = new Discord.Discord.MessageEmbed()
            noperm1.setColor(0xFF0000)
            noperm1.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return send(message, {
                embeds: [noperm1],
                ephemeral: true
            }, true);
        }

        if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) {
            const chnlperm = new Discord.MessageEmbed()
            chnlperm.setColor(0xFF0000)
            chnlperm.setDescription("Check My Permissions.[Missing Permissions:- ADD REACTIONS]")
            return send(message, {
                embeds: [chnlperm],
                ephemeral: true
            }, true)
        }

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter({ text: "Rock Paper Scissors" })
            .setDescription("Add a reaction to one of these emojis to play the game!")
            .setTimestamp();

        const m = await send(message, { embeds: [embed] });
        // Wait for a reaction to be added

        const promptMessage = async function (message, time, validReactions) {
            // We put in the time as seconds, with this it's being transfered to MS
            time *= 1000;

            // For every emoji in the function parameters, react in the good order.
            for (const reaction of validReactions) await message.react(reaction);

            // Only allow reactions from the author, 
            // and the emoji must be in the array we provided.
            const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

            // And ofcourse, await the reactions
            return message
                .awaitReactions({ filter, max: 1, time: time })
                .then(collected => collected.first() && collected.first().emoji.name);
        }

        const reacted = await promptMessage(m, 30, chooseArr);

        // Get a random emoji from the array
        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        // Check if it's a win/tie/loss
        const result = await getResult(reacted, botChoice);
        // Clear the reactions
        await m.reactions.removeAll();

        embed
            .setDescription("")
            .addField(result, `${reacted} vs ${botChoice}`);

        m.edit({ embeds: [embed] });

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📰" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📰")) {
                return "You won!";
            } else if (me === clientChosen) {
                return "It's a tie!";
            } else {
                return "You lost!";
            }
        }
    }

}