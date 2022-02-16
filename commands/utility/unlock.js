const Discord = require("discord.js");
const ms = require('ms');
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "unlock",
    aliases: [],
    accessableby: "Manage Channels",
    description: "Unlock a channel.",
    category: "Utility",
    usage: "=unlock [channel] \n =unlock <channel> (For unlocking any channel) \n =unlock (For unlocking the current channel)",
    example: "=unlock, =unlock #chillzone",
    permission: ["MANAGE_CHANNELS"],
    botreq: "Embed Links, Manage Channel",
    options: [{
        name: "channel",
        description: "The channel to be unlocked, blank for current channel",
        required: false,
        type: 7, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    },],
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




        let channel = options[0]
        // let channel;
        // if (!args[0]) {
        //     channel = message.channel
        // } else {
        //     channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        // }
        // if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return message.reply(`❌ I don't have Manage Channels permission in <#${channel.id}>!`)
        // if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send("Cannot unlock an already unlocked channel")
        // channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }).then(() => {
        //     message.channel.send(`Succesfully unlocked the channel <#${channel.id}>`)
        // }).catch(err => {
        //     console.log(err)
        // })
        if (!channel === undefined) {
            channel = message.channel
        } else {
            if (message.type == "APPLICATION_COMMAND") {

                try {
                    channel = message.guild.channels.cache.get(channel)
                } catch {
                    send(message, { content: 'Please re-write this command carefully' }, true)
                }
            } else {
                try {
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel)
                } catch {
                    send(message, { content: 'Please re-write this command carefully' }, true)
                }
            }
            if (!channel) return send(message, {
                content: `This channel doesn't exist on this server`
            }, true)
        }

        if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return send(message, {
            content: `❌ I don't have Manage Channels permission in <#${channel.id}>!`
        }, true)
        // console.log(channel.permissionsFor(message.guild.roles.everyone).serialize().SEND_MESSAGES)
        if (await channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return send(message, {
            content: "Cannot unlock an already unlocked channel"
        })
        channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
            SEND_MESSAGES: null
        }).then(() => {
            send(message, {
                content: `Succesfully unlocked the channel <#${channel.id}>.`
            }, true)
        }).catch(err => {
            console.log(err)
        })
    }
}