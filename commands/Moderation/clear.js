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

        if (message.type == "DEFAULT" || message.type == "REPLY") {
            await message.delete().catch(error => console.log(error))
        }

        let count = options[0]

        let input = options[1]
        if (!count) return send(message, { content: `<@${author.id}> Please tell how many message do you want to delete` }, false)

        if (!Number(count)) {
            return send(message, { content: `<@${author.id}> Please enter a valid number!` }, false)
        }

        if (!(0 <= Number(count) && Number(count) <= 100)) {
            return send(message, { content: `<@${author.id}> You can delete max 100 at once!` }, false)
        };

        // if (!message.deletable) {
        //     return message.reply("Unable to delete those messages which are 14 days older or more!").then(msg => msg.delete({ timeout: 5000 }))
        // }
        // var lowercase = message.content.toLowerCase()

        // message.channel.bulkDelete(count);


        if (input) {
            if (input.toLowerCase() == "self") {
                // this command will delete messages sent by Aqua X Volt
                message.channel.messages.fetch({
                    limit: 100
                }).then((messages) => {

                    var totalMessages = messages.filter(m => m.author.id === "698905405061070909")
                    var newMessages = Array.from(totalMessages.values()).slice(0, count)
                    // if (message.content.includes("@here") || message.content.includes("@everyone")) return
                    if (!newMessages) return send(message, { content: `<@${author.id}>, No messages found by the bot in this channel!` }, false)
                    var count = newMessages.length
                    try {
                        message.channel.bulkDelete(newMessages)
                    } catch (error) {
                        return send(message, { content: `<@${author.id}>, Unable to delete those messages which are 14 days older or more!` }, false)
                    }
                    if (message.type == "APPLICATION_COMMAND") {
                        return send(message, { content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages of Aqua X Volt` }, false)
                    } else {
                        return send(message, { content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages of Aqua X Volt` }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 1000));
                    }
                })
            } else if (input.toLowerCase() == "invites") {
                // this command will delete server invites present in the channel (limit - 100)
                message.channel.messages.fetch({
                    limit: 100
                }).then((messages) => {
                    var totalMessages = messages.filter(msg => msg.content.toLowerCase().includes("discord.gg/") || msg.content.toLowerCase().includes("https://www.discord.gg/"))
                    var newMessages = Array.from(totalMessages.values()).slice(0, count)
                    // if (message.content.includes("@here") || message.content.includes("@everyone")) return
                    if (!newMessages) return send(message, { content: `<@${author.id}>, No server invites found in this channel!` }, false)

                    var count = newMessages.length
                    try {
                        message.channel.bulkDelete(newMessages)
                    } catch (error) {
                        return send(message, { content: `<@${author.id}>, Unable to delete those messages which are 14 days older or more!` }, false)
                    }
                    if (message.type == "APPLICATION_COMMAND") {
                        return send(message,
                            `<:Bluecheckmark:754538270028726342> Cleared ${count} Server Invites`, false)
                    } else {
                        return send(message, { content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Server Invites` }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 1000));
                    }
                })
            } else if (input) {
                var user = await getMember(bot, args, options, message, author, false, true, 1, false)
                try {
                    if (!user) return send(message, { content: `<@${author.id}>, User not found!` }, false);
                } catch (error) {
                    if (!user) return send(message, { content: `<@${author.id}>, User not found!` }, false);
                }

                message.channel.messages.fetch({
                    limit: 100
                }).then((messages) => {

                    var totalMessages = messages.filter(m => m.author.id === user.id)
                    var newMessages = Array.from(totalMessages.values()).slice(0, count)
                    if (!newMessages) return send(message, { content: `<@${author.id}>,No messages found send by the user!` }, false)
                    var count = newMessages.length
                    try {
                        message.channel.bulkDelete(newMessages)
                    } catch (error) {
                        return send(message, { content: `<@${author.id}> Unable to delete those messages which are 14 days older or more!` }, false)
                    }
                    if (message.type == "APPLICATION_COMMAND") {
                        return send(message, { content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages Of ${user.user.username}#${user.user.discriminator}` }, false)
                    } else {
                        return send(message, { content: `<:Bluecheckmark:754538270028726342> Cleared ${count} Messages Of ${user.user.username}#${user.user.discriminator}` }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 1000));
                    }

                })
            }
        } else {
            try {
                await message.channel.bulkDelete(count)
            } catch (error) {
                return send(message, { content: `<@${author.id}> Unable to delete those messages which are 14 days older or more!` }, false)
            }

            if (message.type == "APPLICATION_COMMAND") {
                return send(message, { content: '<:Bluecheckmark:754538270028726342> Cleared!' }, false)
            } else {
                return send(message,
                    { content: '<:Bluecheckmark:754538270028726342> Cleared!' }, false).then(msg => setTimeout(() => msgDelete(message, msg).catch(error => console.log(error)), 1000));
            }

        }

        // message.channel.send('<:Bluecheckmark:754538270028726342> Cleared!').then(msg => msg.delete({ timeout: 5000 }))

    }
}