const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

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
    options: [{
        name: "type",
        description: "The type of announcement you want to do",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "channel",
        description: "The channel you want to send the announcement",
        required: true,
        type: 7, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "colourcode",
        description: "Hex Color Code for the embed",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "message",
        description: "The message you want to announce",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }, {
        name: "image_link",
        description: "The Image link you want to attach with the embed",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],

    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has(["MENTION_EVERYONE"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Mention Everyone]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MENTION_EVERYONE")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Mention Everyone]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Messages]")
            return send(message, { embeds: [embed],
                ephemeral: true }, true)
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Manage Messages]")
            return send(message, { embeds: [embed],
                ephemeral: true }, true)
        }

        let type22 = options[0]
        let channel22 = options[1]
        let colourcode22 = options[2]
        let message22 = options[3]
        let imagelink22 = options[4]

        if (!type22) {
            const embed09 = new Discord.MessageEmbed()
            embed09.setAuthor({ name: `❌ Wrong format!` })
            embed09.setDescription(`Type =help announce`)
            embed09.setColor(0xFF0000)
            // console.log("ha vaiii")
            return send(message, { embeds: [embed09] }, true)
        }

        let channel;
        if (message.type == "APPLICATION_COMMAND") {
            try {
                channel = message.guild.channels.cache.get(channel22)
            } catch {
                send(message, { content: `${channel22} channel doesn't exist on this server` }, true)
            }
        } else {
            try {
                channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel22)
            } catch {
                send(message, { content: `${channel22} channel doesn't exist on this server` }, true)
            }
        }

        if (type22.toLowerCase() == "everyone") { // =announce everyone #channel #colourcode message

            if (channel22) {
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return send(message, { content: `❌ I don't have Send Messages permission in <#${channel.id}>!` }, true)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return send(message, { content: `❌ I don't have Embed Links permission in <#${channel.id}>!` }, true)
            } else {
                return send(message, { content: `Specify a channel!` }, true)
            }

            if (!colourcode22 || !colourcode22.startsWith('#')) {
                return send(message, { content: `Specify hex color code!` }, true)
            }
            if (colourcode22) {
                var colorname = colourcode22
                // let role1 = (args[args.length - 1])
                // if (args[args.length - 1].startsWith("#")) {
                //     colorname = args[args.length - 1]
                // }
            }
            if (!message22) return send(message, { content: `Send a message with it!` }, true)
            let message2 = message22
            if (message2.length > 1955) return send(message, { content: `Too long message!` }, true)

            const embed = new Discord.MessageEmbed()
            embed.setColor(colorname)
            embed.setTimestamp()
            embed.setDescription(message2)
            const embeds6924 = new Discord.MessageEmbed()
            embeds6924.setColor(`AQUA`)
            embeds6924.setDescription(`<:Bluecheckmark:754538270028726342> **Announcement Sent Successfully**`)
            send(message, { embeds: [embeds6924] }, true)
            channel.send({ content: "@everyone", embeds: [embed] })
        } else if (type22.toLowerCase() == "here") { // =announce here #channel #colourcode message

            if (channel22) {
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return send(message, { content: `❌ I don't have Send Messages permission in <#${channel.id}>!` }, true)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return send(message, { content: `❌ I don't have Embed Links permission in <#${channel.id}>!` }, true)
            } else {
                return send(message, { content: `Specify a channel!` }, true)
            }

            if (!colourcode22 || !colourcode22.startsWith('#')) {
                return send(message, { content: `Specify hex color code!` }, true)
            }
            if (colourcode22) {
                var colorname = colourcode22
                // let role1 = (args[args.length - 1])
                // if (args[args.length - 1].startsWith("#")) {
                //     colorname = args[args.length - 1]
                // }
            }
            if (!message22) return send(message, { content: `Send a message with it!` }, true)
            let message2 = message22
            if (message2.length > 1955) return send(message, { content: `Too long message!` }, true)

            const embed = new Discord.MessageEmbed()
            embed.setColor(colorname)
            embed.setTimestamp()
            embed.setDescription(message2)
            const embeds6924 = new Discord.MessageEmbed()
            embeds6924.setColor(`AQUA`)
            embeds6924.setDescription(`<:Bluecheckmark:754538270028726342> **Announcement Sent Successfully**`)
            send(message, { embeds: [embeds6924] }, true)
            channel.send({ content: "@here", embeds: [embed] })
        } else if (type22.toLowerCase() == "normal") { // =announce normal #channel #colourcode message

            if (channel22) {
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return send(message, { content: `❌ I don't have Send Messages permission in <#${channel.id}>!` }, true)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return send(message, { content: `❌ I don't have Embed Links permission in <#${channel.id}>!` }, true)
            } else {
                return send(message, { content: `Specify a channel!` }, true)
            }

            if (!colourcode22 || !colourcode22.startsWith('#')) {
                return send(message, { content: `Specify hex color code!` }, true)
            }
            if (colourcode22) {
                var colorname = colourcode22
                // let role1 = (args[args.length - 1])
                // if (colorname.startsWith("#")) {
                //     colorname = args[args.length - 1]
                // }
            }
            if (!message22) return send(message, { content: `Send a message with it!` }, true)
            let message2 = message22
            if (message2.length > 1955) return send(message, { content: `Too long message!` }, true)

            const embed = new Discord.MessageEmbed()
            embed.setColor(colorname)
            embed.setTimestamp()
            embed.setDescription(message2)
            const embeds6924 = new Discord.MessageEmbed()
            embeds6924.setColor(`AQUA`)
            embeds6924.setDescription(`<:Bluecheckmark:754538270028726342> **Announcement Sent Successfully**`)
            send(message, { embeds: [embeds6924] }, true)
            channel.send({ embeds: [embed] })
        } else if (type22.toLowerCase() == "image") { // =announce image #channel #colourcode imagelink message

            if (channel22) {
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return send(message, { content: `❌ I don't have Send Messages permission in <#${channel.id}>!` }, true)
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return send(message, { content: `❌ I don't have Embed Links permission in <#${channel.id}>!` }, true)
            } else {
                return send(message, { content: `Specify a channel!` }, true)
            }

            if (!colourcode22 || !colourcode22.startsWith('#')) {
                return send(message, { content: `Specify hex color code!` }, true)
            }
            if (colourcode22) {
                var colorname = colourcode22
                // let role1 = (args[args.length - 1])
                // if (args[args.length - 2].startsWith("#")) {
                //     colorname = args[args.length - 2]
                // }
            }
            if (!message22) return send(message, { content: `Send a link with it!` }, true)

            if (!message22.toLowerCase().includes(`https://`) && !message22.toLowerCase().includes(`http://`)) return send(message, { content: `Invalid Link.` }, true)
            var image = message22

            if (imagelink22) {

                let message2 = message22
                if (message2.length > 1955) return send(message, { content: `Too long message!` }, true)

                const embed = new Discord.MessageEmbed()
                embed.setColor(colorname)
                embed.setTimestamp()
                embed.setImage(image)
                if (message2) {
                    embed.setDescription(message2)
                }
                const embeds6924 = new Discord.MessageEmbed()
                embeds6924.setColor(`AQUA`)
                embeds6924.setDescription(`<:Bluecheckmark:754538270028726342> **Announcement Sent Successfully**`)
                send(message, { embeds: [embeds6924] }, true)
                channel.send({ embeds: [embed] })
            } else {
                const embed = new Discord.MessageEmbed()
                embed.setColor(colorname)
                embed.setTimestamp()
                embed.setImage(image)
                const embeds6924 = new Discord.MessageEmbed()
                embeds6924.setColor(`AQUA`)
                embeds6924.setDescription(`<:Bluecheckmark:754538270028726342> **Announcement Sent Successfully**`)
                send(message, { embeds: [embeds6924] }, true)
                channel.send({ embeds: [embed] })
            }
        } else {
            const embed09 = new Discord.MessageEmbed()
            embed09.setAuthor({ name: `❌ Wrong format!` })
            embed09.setDescription(`Type =help announce`)
            embed09.setColor(0xFF0000)
            // console.log("ha vaiii")
            return message.reply({ embeds: [embed09] })
        }
    }
}