const Discord = require("discord.js");

module.exports = {
    name: "announce",
    aliases: [],
    accessableby: "Manage Messages, Mention Everyone",
    description: "Announce a message",
    category: "Utility",
    usage: "=announce everyone #channel #colourcode message (For everyone tagged embeded message) \n =announce here #channel #colourcode message (For here tagged embeded message) \n =announce image #channel #colourcode imagelink message (For image embeded image) \n =announce normal #channel #colourcode message (For sending a normal message)",
    example: "=announce normal #chillzone #00ffff Yo Guys new updates are coming soon! Stay tuned",
    permission: ["MANAGE_MESSAGES", "MENTION_EVERYONE"],
    botreq: "Embed Links, Mention Everyone",
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has(["MENTION_EVERYONE"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Mention Everyone]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MENTION_EVERYONE")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Mention Everyone]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Messages]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Manage Messages]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!args[0]) {
            const embed09 = new Discord.MessageEmbed()
            embed09.setAuthor(`❌ Wrong format!`)
            embed09.setDescription(`Type =help announce`)
            embed09.setColor(0xFF0000)
            // console.log("ha vaiii")
            return message.reply({ embeds: [embed09] })
        }


        if (args[0].toLowerCase() == "everyone") { // =announce everyone #channel #colourcode message
            let channel;
            if (args[1]) {
                channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                if (!channel) return message.reply(`${args[1]} channel doesn't exist on this server`)
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send(`❌ I don't have Send Messages permission in <#${channel.id}>!`)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send(`❌ I don't have Embed Links permission in <#${channel.id}>!`)
            } else {
                return message.reply(`Specify a channel!`)
            }

            if (!args[2] || !args[2].startsWith('#')) {
                return message.reply(`Specify hex color code!`)
            }
            if (args[2]) {
                var colorname = args[2]
                // let role1 = (args[args.length - 1])
                if (args[args.length - 1].startsWith("#")) {
                    colorname = args[args.length - 1]
                }
            }
            if (!args[3]) return message.reply(`Send a message with it!`)
            let message1 = args
            message1.shift()
            message1.shift()
            message1.shift()
            let message2 = message1.join(" ")
            if (message2.length > 1955) return message.reply(`Too long message!`)

            const embed = new Discord.MessageEmbed()
            embed.setColor(colorname)
            embed.setTimestamp()
            embed.setDescription(message2)
            await message.delete().catch(error => console.log(error))
            channel.send({ content: "@everyone", embeds: [embed] })
        } else if (args[0].toLowerCase() == "here") { // =announce here #channel #colourcode message
            let channel;
            if (args[1]) {
                channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                if (!channel) return message.reply(`${args[1]} channel doesn't exist on this server`)
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send(`❌ I don't have Send Messages permission in <#${channel.id}>!`)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send(`❌ I don't have Embed Links permission in <#${channel.id}>!`)
            } else {
                return message.reply(`Specify a channel!`)
            }

            if (!args[2] || !args[2].startsWith('#')) {
                return message.reply(`Specify hex color code!`)
            }
            if (args[2]) {
                var colorname = args[2]
                // let role1 = (args[args.length - 1])
                if (args[args.length - 1].startsWith("#")) {
                    colorname = args[args.length - 1]
                }
            }
            if (!args[3]) return message.reply(`Send a message with it!`)
            let message1 = args
            message1.shift()
            message1.shift()
            message1.shift()
            let message2 = message1.join(" ")
            if (message2.length > 1955) return message.reply(`Too long message!`)

            const embed = new Discord.MessageEmbed()
            embed.setColor(colorname)
            embed.setTimestamp()
            embed.setDescription(message2)
            await message.delete().catch(error => console.log(error))
            channel.send({ content: "@here", embeds: [embed] })
        } else if (args[0].toLowerCase() == "normal") { // =announce normal #channel #colourcode message
            let channel;
            if (args[1]) {
                channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                if (!channel) return message.reply(`${args[1]} channel doesn't exist on this server`)
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send(`❌ I don't have Send Messages permission in <#${channel.id}>!`)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send(`❌ I don't have Embed Links permission in <#${channel.id}>!`)
            } else {
                return message.reply(`Specify a channel!`)
            }

            if (!args[2] || !args[2].startsWith('#')) {
                return message.reply(`Specify hex color code!`)
            }
            if (args[2]) {
                var colorname = args[2]
                // let role1 = (args[args.length - 1])
                if (args[args.length - 1].startsWith("#")) {
                    colorname = args[args.length - 1]
                }
            }
            if (!args[3]) return message.reply(`Send a message with it!`)
            let message1 = args
            message1.shift()
            message1.shift()
            message1.shift()
            let message2 = message1.join(" ")
            if (message2.length > 1955) return message.reply(`Too long message!`)

            const embed = new Discord.MessageEmbed()
            embed.setColor(colorname)
            embed.setTimestamp()
            embed.setDescription(message2)
            await message.delete().catch(error => console.log(error))
            channel.send({ embeds: [embed] })
        } else if (args[0].toLowerCase() == "image") { // =announce image #channel #colourcode imagelink message
            let channel;
            if (args[1]) {
                channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                if (!channel) return message.reply(`${args[1]} channel doesn't exist on this server`)
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send(`❌ I don't have Send Messages permission in <#${channel.id}>!`)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send(`❌ I don't have Embed Links permission in <#${channel.id}>!`)
            } else {
                return message.reply(`Specify a channel!`)
            }

            if (!args[2] || !args[2].startsWith('#')) {
                return message.reply(`Specify hex color code!`)
            }
            if (args[2]) {
                var colorname = args[2]
                // let role1 = (args[args.length - 1])
                if (args[args.length - 2].startsWith("#")) {
                    colorname = args[args.length - 2]
                }
            }
            if (!args[3]) return message.reply(`Send a link with it!`)

            if (!args[3].toLowerCase().includes(`https://`) && !args[3].toLowerCase().includes(`http://`)) return message.reply(`Invalid Link.`)
            var image = args[3]

            if (args[4]) {
                let message1 = args
                message1.shift()
                message1.shift()
                message1.shift()
                message1.shift()
                let message2 = await message1.join(" ")
                if (message2.length > 1955) return message.reply(`Too long message!`)

                const embed = new Discord.MessageEmbed()
                embed.setColor(colorname)
                embed.setTimestamp()
                embed.setImage(image)
                if (message2) {
                    embed.setDescription(message2)
                }
                await message.delete().catch(error => console.log(error))
                channel.send({ embeds: [embed] })
            } else {
                const embed = new Discord.MessageEmbed()
                embed.setColor(colorname)
                embed.setTimestamp()
                embed.setImage(image)
                await message.delete().catch(error => console.log(error))
                channel.send({ embeds: [embed] })
            }
        } else {
            const embed09 = new Discord.MessageEmbed()
            embed09.setAuthor(`❌ Wrong format!`)
            embed09.setDescription(`Type =help announce`)
            embed09.setColor(0xFF0000)
            // console.log("ha vaiii")
            return message.reply({ embeds: [embed09] })
        }


    }
}