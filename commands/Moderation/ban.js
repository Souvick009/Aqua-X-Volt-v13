const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "ban",
    aliases: [],
    accessableby: "Ban Members",
    description: "bans a member from the server!",
    usage: "=ban <user/userid> [Reason]",
    example: "=ban @Real Warrior Abuse , =ban @Yashu Simping , =ban @Shander",
    category: "Moderation",
    permission: ["BAN_MEMBERS"],
    botreq: "Embed Links, Ban Members, Manage Message",
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has(["BAN_MEMBERS"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Ban Members]")
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

        var embed = new Discord.MessageEmbed()

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
                        member = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0]).catch(error => console.log()) || await bot.users.fetch(args[0]).catch(error => console.log())
                    }
                } else {
                    member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(error => console.log()) || await bot.users.fetch(args[0]).catch(error => console.log())
                }
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else return message.channel.send(`<@${message.author.id}>,` + "You Need To Mention A User!");

        if (member) {
            const guildMember = message.guild.members.cache.get(member.id);
            if (guildMember) {
                if (member.permissions.has("ADMINISTRATOR")) {
                    embed.setColor(0xFF0000)
                    embed.setDescription("❌ You can not ban an Admin.This person seems to be an Admin of this server.")
                    return message.channel.send({
                        embeds: [embed]
                    }).then(m => setTimeout(() => m.delete(), 15000));
                }
            }
        }
        //defining member who will get a warn and fetching id of him so member will be id of user mentioned


        let reason2 = args
        reason2.shift()
        let reason = reason2.join(' ')


        if (!reason) {
            reason = "None"
        }


        async function sendDm() {
            const msg = "You got banned from" + message.guild.name + "\n" + "By: " + message.author.username + "\n" + "Reason: " + reason
            embed.setColor(0x00FFFF)
            embed.setThumbnail(bot.user.displayAvatarURL())
            embed.setDescription(msg);
            embed.setFooter(message.author.tag, message.author.displayAvatarURL())
            embed.setTimestamp()
            await bot.users.cache.get(member.id).send({
                embeds: [embed]
            }).catch(error => {
                console.log(error)
            });

        }




        async function guildmemberBan() {
            const guildMember = message.guild.members.cache.get(member.id);
            var fetchBans = await message.guild.bans.fetch();
            var currentBan = fetchBans.get(member.id)
            if (currentBan) return message.channel.send(`<@${message.author.id}>, This user is already banned from the server`)

            await message.guild.bans.create(member, { reason: reason }).then((user) => {
                {
                    var embed1 = new Discord.MessageEmbed()
                    embed1.setColor(0x00FFFF)
                    if (guildMember) {
                        embed1.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Banned ${user.user.username}*** | **${reason}**`)
                    } else {
                        embed1.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Banned ${user.username}#${user.discriminator}*** | **${reason}**`)
                    }

                    return message.channel.send({ embeds: [embed1] })
                }

            }).catch(err => {
                message.channel.send('I was unable to ban the member');
                console.log(err);
            });
        }

        async function guildBan() {
            if (isNaN(args[0])) return message.channel.send(`<@${message.author.id}>, Either the user is not present in the server or the user doesn't exist on the discord, try to use the user id instead`)
            var fetchBans = await message.guild.bans.fetch();
            // console.log(args[0])
            var currentBan = fetchBans.get(args[0])

            if (currentBan) return message.channel.send(`<@${message.author.id}>, This user is already banned from the server`)

            await message.guild.bans.create(args[0]).then((user) => {
                {
                    var embed1 = new Discord.MessageEmbed()
                    embed1.setColor(0x00FFFF)
                    embed1.description(`<:Bluecheckmark:754538270028726342> ***Successfully Banned ${user}*** | **${reason}**`)
                    return message.channel.send({ embeds: [embed1] })
                }

            }).catch(err => {
                message.channel.send('I was unable to ban the member');
                console.log(err);
            });
        }

        await message.delete().catch(error => console.log(error))

        if (member) {
            const guildMember = message.guild.members.cache.get(member.id);
            if (guildMember) {
                sendDm()
                setTimeout(guildmemberBan, 1000)
            } else {
                setTimeout(guildmemberBan, 1000)
            }
        } else {
            guildBan()
        }

        // if (guildMember) {
        //     setTimeout(secureBan, 1000)
        // } else {
        //     setTimeout(secureBan, 1000)
        // }

    }
}