const Discord = require("discord.js");
const server = require("../../model/server");
const send = require("../../utils/sendMessage.js")

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "Info",
    description: "Returns all commands, or one specific command info",
    usage: "<command | alias>",
    example: "=help || =help mute || =help clear || =help avatar",
    accessableby: "Anyone",
    permission: [""],
    cooldown: 5,
    botreq: ["EMBED_LINKS"],
    options: [{
        name: "command",
        description: "For which command should I send information for?",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {
        var cmdName;
        if (options) {
            cmdName = options[0]
        }
        // If there's an args found
        // Send the info of that command found
        // If no info found, return not found embed.
        if (cmdName) {
            return getCMD(bot, message, cmdName);
        } else {
            // Otherwise send all the commands available
            // Without the cmd info
            return getAll(bot, message, author);
        }
    },
};

async function getAll(bot, message, author) {
    var prefix;

    server.findOne({
        serverID: message.guild.id,
    }, async (err, data) => {
        if (err) console.log(err);
        if (!data || !data.prefix) {
            prefix = "="
        } else if (data) {
            prefix = data.prefix
        }


        // Map all the commands
        // with the specific category

        const commands = (category) => {
            return bot.commands.filter(cmd => cmd.category === category).filter(cmd => cmd.secret === false || !cmd.secret).map(cmd => `\`${cmd.name}\``).join(" | ");
        }
        const categories = ["Moderation", "Info", "Fun", "Utility"]
        // Map all the categories
        const lines = categories.map((category, name) => "**" + category + "**" + "\n" + commands(category));
        console.log(bot.categories)

        const embed = new Discord.MessageEmbed().setColor("#00fff3");
        embed.setDescription(`${lines.join("\n")} \n **Prefix** \n \`${prefix}\` \n For More Information Use **${prefix}help command** \n Example:- **${prefix}help kick**`)
        embed.setFooter({ text: author.tag, iconURL: author.displayAvatarURL() })
        embed.setThumbnail(message.guild.iconURL())
        embed.setTimestamp()
        embed.setTitle("Here are the available commands you can use:")
        return send(message, {
            embeds: [embed]
        });
    })
}

function getCMD(bot, message, input) {
    const embed = new Discord.MessageEmbed();

    // Get the cmd by the name or alias
    const cmd =
        bot.commands.get(input.toLowerCase()) ||
        bot.commands.get(bot.aliases.get(input.toLowerCase()));

    let info = `No information found for command **${input.toLowerCase()}**`;

    // If no cmd is found, send not found embed
    if (!cmd) {
        embed.setColor("RED").setDescription(info)
        return send(message, {
            embeds: [embed]
        });
    }

    // Add all cmd info to the embed
    if (cmd.name) info = `⦿ **Command name**: ${cmd.name}`;
    if (cmd.aliases)
        info += `\n⦿ **Aliases**: ${cmd.aliases.map((a) => `\`${a}\``).join(", ") || "None"}`;
    if (cmd.description) info += `\n⦿ **Description**: ${cmd.description}`;
    if (cmd.example) info += `\n⦿ **Example**: ${cmd.example}`;
    if (cmd.accessableby) info += `\n⦿ **Accessable by**: ${cmd.accessableby}`;
    if (cmd.usage) {
        info += `\n⦿ **Usage**: ${cmd.usage}`;
        embed.setFooter({ text: `Syntax: <> = required, [] = optional` });
    }
    if (cmd.botreq) info += `\n\n:radioactive: **Permissions required for Aqua X Volt to work**: ${cmd.botreq}`;
    embed.setColor("#00fff3").setDescription(info)
    return send(message, {
        embeds: [embed]
    });
}