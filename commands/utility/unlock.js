const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "unlock",
    aliases: [],
    accessableby: "Manage Channels",
    description: "unock a channel. ",
    category: "Utility",
    usage: "=unlock [channel] \n =unlock <channel> (For unlocking any channel) \n =unlock (For unlocking the current channel)",
    example: "=unlock, =unlock #chillzone",
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

        let channel;
        if (!args[0]) {
            channel = message.channel
        } else {
            channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (!channel) message.reply("Channel not found!")
        }

        if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return message.reply(`❌ I don't have Manage Channels permission in <#${channel.id}>!`)

        if (channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send("Cannot unlock an already unlocked channel")
        channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true }).then(() => {
            message.reply(`Succesfully unlocked the channel <#${channel.id}>`)
        }).catch(err => {
            console.log(err)
        })
    }
}