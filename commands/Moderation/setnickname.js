const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "setnickname",
    aliases: ["setnick", "set-nick"],
    accessableby: "Manage Nicknames",
    description: "Change the nickname of a user",
    category: "Moderation",
    usage: "=setnick <user> <new nickname>",
    example: "=setnick @Real Warrior#5085 Real Warrior",
    permission: ["MANAGE_NICKNAMES"],
    botreq: "Embed Links, Manage Nickname",
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has(["MANAGE_NICKNAMES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Nicknames]")
            return message.channel.send({ embeds: [embed] })
        }

        await message.delete().catch(error => console.log(error))

        var member;
        var mention = args[0];
        if (args[0]) {
            try {
                if (message.mentions.repliedUser) {
                    if (mention.startsWith('<@') && mention.endsWith('>')) {
                        mention = mention.slice(2, -1);

                        if (mention.startsWith('!')) {
                            mention = mention.slice(1);
                        }
                        member = await message.guild.members.fetch(mention)
                    } else {
                        member = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0]).catch(error => console.log())
                    }
                } else {
                    member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(error => console.log())
                }
                if (!member) return message.reply("Invalid User!");
            } catch (error) {
                if (!member) return message.reply("Invalid User!");
            }
        } else {
            if (!member) return message.channel.send(`<@${message.author.id}> , Please provide a user to change his/her's nickname!`);
        }

        if (!args[1]) return message.channel.send(`<@${message.author.id}> Please provide a nickname!`)

        let nickname1 = args
        nickname1.shift()
        let nickname = nickname1.join(" ")

        if (nickname.length > 32) {
            return message.channel.send(`<@${message.author.id}> The nickname must be 32 or fewer in length`)
        }

        const memberRole = member.roles.highest.rawPosition
        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")
        if (!botrole) return message.channel.send(`<@${message.author.id}>, It seems that my role isn't assigned to me, re-invite me to fix it or make a role named "Aqua X Volt" and assign it to me.`)

        if (member.user.id === message.guild.ownerID) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`❌ ${member.user.tag} seems to be the owner of this server, I can't change his/her's nickname`)
            embed.setColor(0xff4a1f)
            return await message.channel.send({ embeds: [embed] })
        }

        if (memberRole > botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`❌ Please Check My Permission, Maybe my role isn't higher enough in order to change nickname of ${member.user.tag}`)
            embed.setColor(0xff4a1f)
            return await message.channel.send({ embeds: [embed] })
        }

        member.setNickname(nickname)
        const embed1 = new Discord.MessageEmbed()
        embed1.setColor(0x00FFFF)
        embed1.setDescription(`<a:zzz_tick:853390761474129971> Set ${member.user.tag}'s nickname to ${nickname}.`)
        message.channel.send({ embeds: [embed1] })
    }
}
