const Discord = require("discord.js");
const serverUser = require("../../model/serverUser.js")
const server = require("../../model/server.js")
const perms = Discord.Permissions.FLAGS
var { uuid } = require("uuidv4")
const moment = require("moment");


module.exports = {
    name: "warn",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Warns a member",
    category: "Moderation",
    usage: "=warn <mention/userid> [Reason]",
    example: "=warn @Real Warrior#5085 Abuse",
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links, Manage Messages",
    run: async (bot, message, args) => {

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

        await message.delete().catch(error => console.log(error))

        //defining member who will get a warn and fetching id of him so member will be id of user mentioned
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
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else {
            if (!member) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }
        //storing data in db according to total warns, member warned, guild id
        const Createdd = Date.now()
        const iddd = uuid()
        const reason = args.slice(1).join(" ");

        if (member.permissions.has(perms.ADMINISTRATOR)) return message.channel.send(`<@${message.author.id}> , ❌ You can not warn an Admin. This person seems to be an Admin of this server.`).then(m => setTimeout(() => m.delete(), 5000));

        if (!reason) return message.channel.send(`<@${message.author.id}> , You didn't specify a reason!`).then(m => setTimeout(() => m.delete(), 5000));



        serverUser.findOne({
            serverID: message.guild.id,
            userID: member.id,

        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) {
                const newUser = new serverUser({
                    serverID: message.guild.id,
                    userID: member.id,
                })
                await newUser.save().catch(e => console.log(e));
                var warnObj = {
                    administrator: message.author.tag,
                    reason: reason,
                    id: iddd,
                    date: Createdd
                };
                newUser.warns.push(warnObj);
                await newUser.save().catch(e => console.log(e));

            } else if (user) {
                var warnObj = {
                    administrator: message.author.tag,
                    reason: reason,
                    id: iddd,
                    date: Createdd
                };
                user.warns.push(warnObj);
                await user.save().catch(e => console.log(e));
            }
        })

        const embed = new Discord.MessageEmbed()
        embed.setColor(0x00FFFF)
        embed.setDescription(`<:Bluecheckmark:754538270028726342> ***${member} has been warned*** | **${reason}**`);
        message.channel.send({ embeds: [embed] });

        //Notifing warnings through DM
        // const mention = message.mentions.members.first();

        embed.setColor(0x00FFFF)
        embed.setDescription(`<:Bluecheckmark:754538270028726342> ***You have been warned in ${message.guild.name}*** | **${reason}**`);
        var dmUser = await bot.users.fetch(member.id)
        dmUser.send({ embeds: [embed] }).catch(error => {
            if (error) {
                console.log(error);
            }
        });
        // try {

        // } catch (error) {
        //     console.log(error);
        // }

        //defining member who will get a warn and fetching id of him so member will be id of user mentioned

    }

}