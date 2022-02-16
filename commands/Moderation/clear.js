const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");
const msgDelete = require("../../utils/deleteMessage.js")

module.exports = {
    name: "clear",
    description: "Delete messages at once!",
    usage: `=clear [count] (For deleting recent messages present in the channel) \n =clear [count] [tag] (For deleting messages of a specific user) \n =clear [count] invites (For deleting Discord Server's invite links present in the channel) \n =clear [count] self (For deleting Aqua X Volt's messages) \n (Note:- You can delete max 100 at once! but unable to delete those messages which are 14 days older or more.)`,
    example: "=clear 10 \n =clear 97 \n =clear 69 ",
    accessableby: "MANAGE_MESSAGES",
    aliases: ["purge"],
    accessableby: "Manages Messages",
    botreq: ["EMBED_LINKS", "MANAGE_MESSAGES"],
    permission: ["MANAGE_MESSAGES"],
    category: "Moderation",
    options: [{
        name: "count",
        description: "No. of message to be deleted",
        required: true,
        type: 4, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "integer"
    },
    {
        name: "type",
        description: "type of clear command, =help clear for more information",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }
    ],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            const botembed = new Discord.MessageEmbed()
            botembed.setColor(0xFF0000)
            botembed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE_MESSAGES]")
            return send(message, {
                embeds: [botembed],
                ephemeral: true
            }, true)
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embedChannel = new Discord.MessageEmbed()
            embedChannel.setColor(0xFF0000)
            embedChannel.setDescription(`❌ Check My Permissions in <#${message.channel.id}>. [Missing Permissions:- MANAGE_MESSAGES]`)
            return send(message, {
                embeds: [embedChannel],
                ephemeral: true
            }, true)
        }

        if (message.type !== "APPLICATION_COMMAND") {
            await message.delete().catch(error => console.log(error))
        }

        let count = parseInt(options[0])
        console.log(options)
        let input = options[1]
        if (!count) return send(message, {
            content: `<@${author.id}> Please tell how many message do you want to delete`
        }, false)

        if (!Number(count)) {
            return send(message, {
                content: `<@${author.id}> Please enter a valid number!`
            }, false)
        }

        if (!(0 <= Number(count) && Number(count) <= 100)) {
            return send(message, {
                content: `<@${author.id}> You can delete max 100 at once!`
            }, false)
        };

        // if (!message.deletable) {
        //     return message.reply("Unable to delete those messages which are 14 days older or more!").then(msg => msg.delete({ timeout: 5000 }))
        // }
        // var lowercase = message.content.toLowerCase()

        // message.channel.bulkDelete(count);


        if (input) {
            if (input.toLowerCase() == "self") {
                // this command will delete messages sent by Aqua X Volt
                var messages = await message.channel.messages.fetch({
                    limit: 100
                })
                var totalMessages = [...messages.filter(m => m.author.id === bot.user.id).values()]
                console.log(count)
                var newMessages = totalMessages.slice(0, count)
                newMessages.forEach(m => {
                    console.log(m.content)
                })
                // console.log(typeof(totalMessages))
                // console.log(Array.from(totalMessages.values).slice(totalMessages.length-count, totalMessages.length))
                if (!newMessages) return send(message, {
                    content: `<@${author.id}>, No messages found by the bot in this channel!`
                }, false)
                count = newMessages.length
                try {
                    await message.channel.bulkDelete(newMessages)
                } catch (error) {
                    console.log(error)
                    return send(message, {
                        content: `<@${author.id}> Unable to delete those messages which are 14 days older or more!`
                    }, false)
                }

                if (message.type == "APPLICATION_COMMAND") {
                    return send(message, {
                        content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages of Aqua X Volt`,
                        ephemeral: true
                    }, false)
                } else {
                    return send(message, {
                        content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages of Aqua X Volt`
                    }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 50));
                }

            } else if (input.toLowerCase() == "invites") {
                // this command will delete server invites present in the channel (limit - 100)
                console.log(" count " + count)

                var messages = await message.channel.messages.fetch({
                    limit: 100
                })
                var totalMessages = [...messages.filter(m => m.content.toLowerCase().includes("discord.gg/") || m.content.toLowerCase().includes("https://www.discord.gg/")).values()]
                console.log(count)
                var newMessages = totalMessages.slice(0, count)
                newMessages.forEach(m => {
                    console.log(m.content)
                })

                if (!newMessages) return send(message, {
                    content: `<@${author.id}>, No server invites found in this channel!`
                }, false)

                count = newMessages.length
                try {
                    await message.channel.bulkDelete(newMessages)
                } catch (error) {
                    console.log(error)
                    return send(message, {
                        content: `<@${author.id}> Unable to delete those messages which are 14 days older or more!`
                    }, false)
                }

                if (message.type == "APPLICATION_COMMAND") {
                    return send(message, {
                        content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Server Invites`,
                        ephemeral: true
                    }, false)
                } else {
                    return send(message, {
                        content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Server Invites`
                    }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 50));
                }
            } else if (input) {
                var user = await getMember(bot, args, options, message, author, false, true, 1, true)
                var iD;

                if (!user) {
                    iD = input
                } else {
                    iD = user.id
                }

                console.log(" count " + count)

                var messages = await message.channel.messages.fetch({
                    limit: 100
                })
                var totalMessages = [...messages.filter(m => m.author.id === iD).values()]
                console.log(count)
                var newMessages = totalMessages.slice(0, count)
                newMessages.forEach(m => {
                    console.log(m.content)
                })
                // console.log(typeof(totalMessages))
                // console.log(Array.from(totalMessages.values).slice(totalMessages.length-count, totalMessages.length))
                if (!newMessages) return send(message, {
                    content: `<@${author.id}>,No messages found send by the user!`
                }, false)
                count = newMessages.length
                try {
                    await message.channel.bulkDelete(newMessages)
                } catch (error) {
                    console.log(error)
                    return send(message, {
                        content: `<@${author.id}> Unable to delete those messages which are 14 days older or more!`
                    }, false)
                }
                if (message.type == "APPLICATION_COMMAND") {
                    if (user) {
                        return send(message, {
                            content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages Of ${user.user.username}#${user.user.discriminator}`,
                            ephemeral: true
                        }, false)
                    } else {
                        return send(message, {
                            content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages`
                        }, false)
                    }
                } else {
                    if (user) {
                        return send(message, {
                            content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages Of ${user.user.username}#${user.user.discriminator}`
                        }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 50));
                    } else {
                        return send(message, {
                            content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages`
                        }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 50));
                    }
                }
            }
        } else {
            try {
                await message.channel.bulkDelete(count)
            } catch (error) {
                return send(message, {
                    content: `<@${author.id}> Unable to delete those messages which are 14 days older or more!`
                }, false)
            }

            if (message.type == "APPLICATION_COMMAND") {
                return send(message, {
                    content: '<:Bluecheckmark:754538270028726342> Cleared!',
                    ephemeral: true
                }, false)
            } else {
                return send(message, {
                    content: '<:Bluecheckmark:754538270028726342> Cleared!'
                }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 50));
            }

        }

        // message.channel.send('<:Bluecheckmark:754538270028726342> Cleared!').then(msg => msg.delete({ timeout: 5000 }))

    }
}