const Discord = require("discord.js");
const ms = require('ms');

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
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- BAN MEMBERS]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const noperm = new Discord.MessageEmbed()
            noperm.setColor(0xFF0000)
            noperm.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return message.channel.send({ embeds: [noperm] });
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const noperm1 = new Discord.MessageEmbed()
            noperm1.setColor(0xFF0000)
            noperm1.setDescription(`❌ I don't have permission in this channel! [Missing Permissions:- MANAGE MESSAGES]`)
            return message.channel.send({ embeds: [noperm1] });
        }

        await message.delete().catch(error => console.log())

        var user;
        if (!args) return message.channel.send(`<@${message.author.id}> Please provide a user id!`)
        if (!isNaN(args)) {
            user = await bot.users.fetch(args).catch(error => console.log())
        } else {
            let usertag = args.join(" ").split("#")
            if (usertag.length < 2) return message.channel.send(`<@${message.author.id}> Couldnt find the user please use user id instead`)
            user = bot.users.cache.filter(user => user.username === usertag[0]).find(user => user.discriminator === usertag[1]);
            if (!user) return message.channel.send(`<@${message.author.id}> Couldnt find the user please use user id instead`)
        }

        if (user) {
            const banList = await message.guild.bans.fetch();
            const bannedUser = banList.get(user.id)
            if (bannedUser) {
                message.guild.members.unban(user)
                const unbanned = new Discord.MessageEmbed()
                unbanned.setColor(0x00FFFF)
                unbanned.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Unbanned ${user.tag}***`)
                return message.channel.send({ embeds: [unbanned] })
            } else {
                const notbanned = new Discord.MessageEmbed()
                notbanned.setColor(0xFF0000)
                notbanned.setDescription(`❌ **${user.tag} isn\'t banned**`)
                return message.channel.send({ content: `<@${message.author.id}>`, embeds: [notbanned] });
            }
        } else if (!user) {
            var fetchBans = await message.guild.bans.fetch();
            var currentBan = fetchBans.get(args[0])
            if (!currentBan) return message.channel.send(`<@${message.author.id}>, Couldn't find the user in the ban list of the server`)
            console.log(currentBan)
            if (currentBan) {
                var unban = await message.guild.bans.remove(args[0]).catch(error => console.log(error))
                const unbanned = new Discord.MessageEmbed()
                unbanned.setColor(0x00FFFF)
                unbanned.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Unbanned ${unban.username}#${unban.discriminator}***`)
                return message.channel.send({ embeds: [unbanned] })

            }
        }
    }
}