const Discord = require("discord.js");
const ms = require('ms');
const send = require("../../utils/sendMessage.js")

module.exports = {
    name: "slowmode",
    aliases: ["sm"],
    accessableby: "Manage Channels",
    description: "Sets slowmode in the channel",
    category: "Utility",
    usage: "=slowmode <time> [channel] \n =slowmode <time> (For current channel) \n =slowmode <time> <channel> (For another channel)",
    example: "=slowmode 5m, =slowmode 5m #chillzone",
    permission: ["MANAGE_CHANNELS"],
    botreq: "Embed Links, Manage Channel",
    options: [{
        name: "time",
        description: "How much slowmode should be there?",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "channel",
        description: "Add slowmode to which channel? Defaults to current channel",
        required: false,
        type: 7, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has(["MANAGE_CHANNELS"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE CHANNELS]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true);
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- MANAGE CHANNELS]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }


        // await message.delete();

        if (!options[0]) return send(message, { content: `Please specify the time!` }, true)

        if (options[0].length > 100) return send(message, { content: `The time exceeds the limit.` }, true)

        let channel;
        if (!options[1]) {
            channel = message.channel
        } else {
            if (message.type == "APPLICATION_COMMAND") {
                try {
                    channel = message.guild.channels.cache.get(options[1])
                } catch {
                    send(message, { content: 'Please re-write the command correctly' }, true)
                }
            } else {
                try {
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(options[1])
                } catch {
                    send(message, { content: 'Please re-write the command correctly' }, true)
                }
            }
        }
        if (!channel) return send(message, { content: "This channel doesn't exist" }, true)
        if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return send(message, { content: `❌ I don't have Manage Channels permission in <#${channel.id}>!` })

        var time1;
        if (options[0].toLowerCase() == "off" || options[0] == "0") {
            time = 0
            if (isNaN(time)) return send(message, { content: "Invalid Format, Cannot use that as slowmode" }, true)
        } else {
            time1 = (ms(options[0])) / 1000
            var time = Math.round(time1)
            if (isNaN(time)) return send(message, { content: "Invalid Format, Cannot use that as slowmode" }, true)
            if (time < 1) return send(message, { content: "Minimum is 1 Second" }, true)
            if (time > 21600) return send(message, { content: "Maximum is 6 hours" }, true)
        }

        // if (isNaN(time)) return send("Cannot use that as slowmode")
        // if (time <= 1) return send("Min is 1 minute")
        // if (time > 21600) return send("Max is 6 hours")
        // console.log(time)

        channel.setRateLimitPerUser(time).then(() => {
            if (options[0].toLowerCase() == "off" || options[0] == "0") {
                send(message, { content: `Slowmode is now turned off for the <#${channel.id}> channel` }, true)
            } else {
                send(message, { content: `Succesfully added slowmode of ${ms(time * 1000)} to the <#${channel.id}> channel` }, true)
            }

        }).catch(err => {
            console.log(err)
        })

    }
}