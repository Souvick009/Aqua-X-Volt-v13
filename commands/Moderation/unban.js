const Discord = require("discord.js");
const ms = require('ms');
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "unban",
    aliases: ["ub"],
    accessableby: "Ban Members",
    description: "unbans a member from the server!",
    usage: "=unban <userid>",
    example: "=unban 583332908144656387 , =unban 599935307349098506, =unban 485451048450916368",
    category: "Moderation",
    permission: ["BAN_MEMBERS"],
    botreq: "Embed Links, Ban Members, Manage Messages",
    options: [{
        name: "user",
        description: "For which command should I send information for?",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    },
    {
        name: "reason",
        description: "For which command should I send information for?",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- BAN MEMBERS]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const noperm = new Discord.MessageEmbed()
            noperm.setColor(0xFF0000)
            noperm.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return send(message, {
                embeds: [noperm],
                ephemeral: true
            }, true);
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const noperm1 = new Discord.MessageEmbed()
            noperm1.setColor(0xFF0000)
            noperm1.setDescription(`❌ I don't have permission in this channel! [Missing Permissions:- MANAGE MESSAGES]`)
            return send(message, {
                embeds: [noperm1],
            }, true);
        }

        var user;
        var input = options[0]

        if (!input) return send(message, { content: `Please provide a user id!` }, true)

        if (!isNaN(input)) {
            user = await bot.users.fetch(args).catch(error => console.log())
        }

        if (message.type == "DEFAULT" || message.type == "REPLY") {
            await message.delete().catch(error => console.log())
        }

        if (user) {
            const banList = await message.guild.bans.fetch();
            const bannedUser = banList.get(user.id)
            if (bannedUser) {
                message.guild.members.unban(user)
                const unbanned = new Discord.MessageEmbed()
                unbanned.setColor(0x00FFFF)
                unbanned.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Unbanned ${user.tag}***`)
                return send(message, { embeds: [unbanned] }, false)
            } else {
                const notbanned = new Discord.MessageEmbed()
                notbanned.setColor(0xFF0000)
                notbanned.setDescription(`❌ **${user.tag} isn\'t banned**`)
                return send(message, {
                    embeds: [notbanned],
                    ephemeral: true
                }, true);
            }
        } else if (!user) {
            var fetchBans = await message.guild.bans.fetch();
            var currentBan = fetchBans.get(input)
            if (!currentBan) return send(message, { content: `Couldn't find the user in the ban list of the server` }, false)
            // console.log(currentBan)
            if (currentBan) {
                var unban = await message.guild.bans.remove(input).catch(error => console.log(error))
                const unbanned = new Discord.MessageEmbed()
                unbanned.setColor(0x00FFFF)
                unbanned.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Unbanned ${unban.username}#${unban.discriminator}***`)
                return send(message, { embeds: [unbanned] }, false)

            }
        }
    }
}