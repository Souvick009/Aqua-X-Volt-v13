const Discord = require("discord.js");

module.exports = {
    name: "kick",
    aliases: [],
    accessableby: "Kick Members",
    description: "Kicks a member from the server!",
    usage: "=kick <user/userid> [reason]",
    example: "=kick @Real Warrior , =kick @Yashu , =kick @Shander",
    category: "Moderation",
    permission: ["KICK_MEMBERS"],
    botreq: "Embed Links, Kick Members, Manage Messages",

    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- KICK MEMBERS]")
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
            if (!member) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }

        const user = member.user
        var blocked = false
        if (member.permissions.has("ADMINISTRATOR")) {
            const embed1 = new Discord.MessageEmbed()
            embed1.setColor(0xFF0000)
            embed1.setDescription("❌ You can not kick an Admin.This person seems to be an Admin of this server.")
            return message.channel.send({ embeds: [embed1] }).then(m => setTimeout(() => m.delete(), 15000));
        }
        //defining member who will get a warn and fetching id of him so member will be id of user mentioned



        let reason2 = args
        reason2.shift()
        let reason = reason2.join(' ')

        if (!reason) {
            reason = "None"
        }

        async function sendDm() {
            const msg = "You got kicked from" + message.guild.name + "\n" + "By: " + message.author.username + "\n" + "Reason: " + reason
            const embed1 = new Discord.MessageEmbed()
            embed1.setColor(0x00FFFF)
            embed1.setThumbnail(bot.user.displayAvatarURL())
            embed1.setDescription(msg);
            embed1.setFooter(message.author.tag, message.author.displayAvatarURL())
            embed1.setTimestamp()
            const embed2 = new Discord.MessageEmbed();
            await bot.users.cache.get(member.id).send({
                embeds: [embed1]
            }).catch(error => {
                console.log(error)
            });
            
            // await bot.users.cache.get(member.id).send({ embeds: [embed1] }).catch(error => {
            //     // Only log the error if the user's dm is off
            //     if (error) {
            //         console.log(error)
            //         embed2.setColor(0xFF0000)
            //         embed2.setDescription(`❌ I was unable to dm that User! `);
            //         blocked = true
            //         return //message.channel.send(embed2);

            //     }
            // });


        }

        if (member) {
            const guildMember = message.guild.members.cache.get(member.id);
            if (guildMember) {
                sendDm()
                setTimeout(kick, 1000)
            } else {
                message.channel.send(`<@${message.author.id}> That user isn\'t in the this guild`)
            }

        } else {
            message.channel.send(`<@${message.author.id}> You need to specify a person!`)
        }
        function kick() {
            member.kick('You Were Kicked From The Server!').then(() => {
                {
                    const embed2 = new Discord.MessageEmbed()
                    embed2.setColor(0x00FFFF)
                    embed2.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Kicked ${user.username}*** | **${reason}**`)
                    return message.channel.send({ embeds: [embed2] })
                }

            }).catch(err => {
                message.channel.send(`<@${message.author.id}> I was unable to kick the member`);
                console.log(err);
            });
        }
    }
}