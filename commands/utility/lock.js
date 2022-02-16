const Discord = require("discord.js");
const ms = require('ms');
const send = require("../../utils/sendMessage.js")

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
    options: [{
        name: "channel",
        description: "The channel to be locked, blank for current channel",
        required: false,
        type: 7, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    },
    {
        name: "time",
        description: "Duration of this channel to be locked, blank for permanent",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }
    ],
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

        async function timeLock() {

            if (time.length > 100) return send(message, { content: `The time exceeds the limit.` }, true)

            let newTime;
            try {
                newTime = ms(ms(time))
            } catch (error) {
                should = false
                return send(message, { content: "Please provide a valid time" }, true)
            }

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

            if (ms(time) > 604800000) {
                return send(message, { content: `Max Limit is 7 days` }, true)
            }

            if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return send(message, { content: `❌ I don't have Manage Channels permission in <#${channel.id}>!` }, true)
            if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return send(message, { content: "Cannot lock an already locked channel" },)
            await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                SEND_MESSAGES: false
            })
            await channel.permissionOverwrites.edit(message.guild.me, {
                SEND_MESSAGES: true
            }).then(() => {
                send(message, { content: `Succesfully locked the channel <#${channel.id}> for ${newTime}` }, true)
            }).catch(err => {
                console.log(err)
            })

            setTimeout(async () => {
                await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                    SEND_MESSAGES: true
                })
            }, ms(time));
        }

        async function permLock() {

            if (channel === undefined) {
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

            if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return send(message, { content: `❌ I don't have Manage Channels permission in <#${channel.id}>!` }, true)
            if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return send(message, { content: "Cannot lock an already locked channel" }, false)
            try {
                await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                    SEND_MESSAGES: false
                })
                await channel.permissionOverwrites.edit(message.guild.me, {
                    SEND_MESSAGES: true
                }).then(() => {
                    send(message, { content: `Succesfully locked the channel <#${channel.id}>` }, true)
                })
            } catch (err) {
                console.log(err)
            }
        }

        var should = true
        let channel;
        if (message.type == "APPLICATION_COMMAND") {
            channel = options[0]
            time = options[1]
        } else {
            channel = args[0]
            time = args[1]
        }

        if (should == false) return
        if (!time) {
            return permLock()
        } else {
            timeLock()
        }
    }
}