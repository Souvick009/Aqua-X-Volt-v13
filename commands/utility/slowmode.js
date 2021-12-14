const Discord = require("discord.js");
const ms = require('ms');

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
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has(["MANAGE_CHANNELS"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE CHANNELS]")
            return message.channel.send({ embeds: [embed] });
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- MANAGE CHANNELS]")
            return message.channel.send({ embeds: [embed] })
        }


        // await message.delete();

        if (!args[0]) return message.reply(`Please specify the time!`)

        let channel;
        if (!args[1]) {
            channel = message.channel
        } else {
            channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        }

        if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return message.reply(`❌ I don't have Manage Channels permission in <#${channel.id}>!`)

        var time1;
        if (args[0].toLowerCase() == "off" || args[0] == "0") {
            time = 0
            if (isNaN(time)) return message.reply("Cannot use that as slowmode")
        } else {
            time1 = (ms(args[0])) / 1000
            var time = Math.round(time1)
            if (isNaN(time)) return message.reply("Cannot use that as slowmode")
            if (time < 1) return message.reply("Minimum is 1 Second")
            if (time > 21600) return message.reply("Maximum is 6 hours")
        }

        // if (isNaN(time)) return message.reply("Cannot use that as slowmode")
        // if (time <= 1) return message.reply("Min is 1 minute")
        // if (time > 21600) return message.reply("Max is 6 hours")
        // console.log(time)
        channel.setRateLimitPerUser(time).then(() => {
            if (args[0].toLowerCase() == "off" || args[0] == "0") {
                message.channel.send(`Slowmode is now turned off for the <#${channel.id}> channel`)
            } else {
                message.channel.send(`Succesfully added slowmode of ${time} to the <#${channel.id}> channel`)
            }

        }).catch(err => {
            console.log(err)
        })

    }
}