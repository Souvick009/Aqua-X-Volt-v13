const Discord = require("discord.js");

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
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            const botembed = new Discord.MessageEmbed()
            botembed.setColor(0xFF0000)
            botembed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE_MESSAGES]")
            return message.channel.send({ embeds: [botembed] })
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embedChannel = new Discord.MessageEmbed()
            embedChannel.setColor(0xFF0000)
            embedChannel.setDescription(`❌ Check My Permissions in <#${message.channel.id}>. [Missing Permissions:- MANAGE_MESSAGES]`)
            return message.reply({ embeds: [embedChannel] })
        }

        await message.delete().catch(error => console.log(error))

        if (!args[0]) return message.channel.send(`<@${message.author.id}> Please tell how many message do you want to delete`)

        if (!Number(args[0])) {
            return message.channel.send(`<@${message.author.id}> Please enter a valid number!`)
        }

        if (!(0 <= Number(args[0]) && Number(args[0]) <= 100)) {
            return message.channel.send(`<@${message.author.id}> You can delete max 100 at once!`)
        };

        // if (!message.deletable) {
        //     return message.reply("Unable to delete those messages which are 14 days older or more!").then(msg => msg.delete({ timeout: 5000 }))
        // }
        var lowercase = message.content.toLowerCase()

        // message.channel.bulkDelete(args[0]);
        if (args[1]) {
            if (args[1].toLowerCase() == "self") {
                // this command will delete messages sent by Aqua X Volt
                message.channel.messages.fetch({ limit: 100 }).then((messages) => {

                    var totalMessages = messages.filter(m => m.author.id === "698905405061070909")
                    var newMessages = Array.from(totalMessages.values()).slice(0, args[0])
                    // if (message.content.includes("@here") || message.content.includes("@everyone")) return
                    if (!newMessages) return message.reply("No messages found by the bot in this channel!")
                    var count = newMessages.length
                    try {
                        message.channel.bulkDelete(newMessages)
                    } catch (error) {
                        return message.channel.send(`<@${message.author.id}> Unable to delete those messages which are 14 days older or more!`)
                    }
                    return message.channel.send(`<:Bluecheckmark:754538270028726342> Cleared ${count} Messages of Aqua X Volt`).then(msg => setTimeout(() => msg.delete().catch(error => console.log(error)), 1000));

                })
            }
            else if (args[1].toLowerCase() == "invites") {
                // this command will delete server invites present in the channel (limit - 100)
                message.channel.messages.fetch({ limit: 100 }).then((messages) => {
                    var totalMessages = messages.filter(msg => msg.content.toLowerCase().includes("discord.gg/") || msg.content.toLowerCase().includes("https://www.discord.gg/"))
                    var newMessages = Array.from(totalMessages.values()).slice(0, args[0])
                    // if (message.content.includes("@here") || message.content.includes("@everyone")) return
                    if (!newMessages) return message.reply("No server invites found in this channel!")

                    var count = newMessages.length
                    try {
                        message.channel.bulkDelete(newMessages)
                    } catch (error) {
                        return message.channel.send(`<@${message.author.id}> Unable to delete those messages which are 14 days older or more!`)
                    }
                    return message.channel.send(`<:Bluecheckmark:754538270028726342> Cleared ${count} Server Invites`).then(msg => setTimeout(() => msg.delete().catch(error => console.log(error)), 1000));

                })
            } else if (args[1]) {
                var user;

                try {
                    user = message.mentions.members.first() || await message.guild.members.fetch(args[1])
                    if (!user) return message.channel.send(`<@${message.author.id}>, User not found!`);
                } catch (error) {
                    if (!user) return message.channel.send(`<@${message.author.id}>, User not found!`);
                }

                message.channel.messages.fetch({ limit: 100 }).then((messages) => {

                    var totalMessages = messages.filter(m => m.author.id === user.id)
                    var newMessages = Array.from(totalMessages.values()).slice(0, args[0])
                    if (!newMessages) return message.reply("No messages found send by the user!")
                    var count = newMessages.length
                    try {
                        message.channel.bulkDelete(newMessages)
                    } catch (error) {
                        return message.channel.send(`<@${message.author.id}> Unable to delete those messages which are 14 days older or more!`)
                    }
                    return message.channel.send(`<:Bluecheckmark:754538270028726342> Cleared ${count} Messages Of ${user.user.username}#${user.user.discriminator}`).then(msg => setTimeout(() => msg.delete().catch(error => console.log(error)), 1000));

                })
            }
        } else {
            try {
                await message.channel.bulkDelete(args[0])
            } catch (error) {
                console.log(error)
                return message.channel.send(`<@${message.author.id}> Unable to delete those messages which are 14 days older or more!`)
            }

            return message.channel.send('<:Bluecheckmark:754538270028726342> Cleared!').then(msg => setTimeout(() => msg.delete().catch(error => console.log(error)), 1000));

        }



        // message.channel.send('<:Bluecheckmark:754538270028726342> Cleared!').then(msg => msg.delete({ timeout: 5000 }))

    }
}