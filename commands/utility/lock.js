const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "lock",
    aliases: [],
    accessableby: "Manage Channels",
    description: "Lock a channel.",
    category: "Utility",
    usage: "=lock [channel] [time].  \n =lock <channel> (For locking any channel permanently) \n =lock (For unlocking any channel) \n =lock <channel> <time> (For locking any channel temporarily)",
    example: "=lock #chillzone 5m, =lock, =lock #chillzone",
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

        function timeLock() {

            let channel;
            let newTime;
            try {
                newTime = ms(ms(time))
                // console.log("Normal time " + ms(time))
            } catch (error) {
                message.reply("Please provide a valid time")
                should = false
            }

            if (!args[0]) {
                channel = message.channel
            } else {
                channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            }

            if (ms(time) > 604800000) {
                return message.reply(`Max Limit is 7 days`)
            }

            if (!channel) message.reply("Channel not found!")

            if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return message.reply(`❌ I don't have Manage Channels permission in <#${channel.id}>!`)
            if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send("Cannot lock an already locked channel")
            channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }).then(() => {
                message.reply(`Succesfully locked the channel <#${channel.id}> for ${newTime}`)
            }).catch(err => {
                console.log(err)
            })

            setTimeout(async () => {
                await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true })
            }, ms(time));
        }

        function permLock() {
            let channel;

            if (!args[0]) {
                channel = message.channel
            } else {
                channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) return message.reply(`${args[0]} channel doesn't exist on this server`)
            }

            if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return message.reply(`❌ I don't have Manage Channels permission in <#${channel.id}>!`)
            if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send("Cannot lock an already locked channel")
            try {
                channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }).then(() => {
                    message.reply(`Succesfully locked the channel <#${channel.id}>`)
                })
            } catch (err) {
                console.log(err)
            }
        }

        var should = true
        let time = args[1];


        // let channel;
        // if (!args[0]) {
        //     channel = message.channel
        // } else {
        //     channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        // }
        // if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return message.reply(`❌ I don't have Manage Channels permission in <#${channel.id}>!`)
        // if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send("Cannot lock an already locked channel")
        // channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }).then(() => {
        //     message.channel.send(`Succesfully locked the channel <#${channel.id}>`)
        // }).catch(err => {
        //     console.log(err)
        // })

        if (should == false) return
        if (!time) {
            return permLock()
        } else {
            timeLock()
        }

    }

}