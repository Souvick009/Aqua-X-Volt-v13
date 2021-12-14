const Discord = require("discord.js");

module.exports = {

    name: "dm",
    aliases: ["Direct_Message", "PM"],
    accessableby: "Manage Messages",
    description: "Dm a user!",
    usage: "=dm <user> <message>",
    example: "=dm @Real Warrior Hello Sir , =dm @Shander Hello Pro Developer 🙏 , =dm <@!603508758626435072> Yo",
    category: "Fun",
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links, Manage Message",
    run: async (bot, message, args) => {
        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const noperm = new Discord.MessageEmbed()
            noperm.setColor(0xFF0000)
            noperm.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return message.channel.send({
                embeds: [noperm]
            });
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const noperm1 = new Discord.MessageEmbed()
            noperm1.setColor(0xFF0000)
            noperm1.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return message.channel.send({
                embeds: [noperm1]
            });
        }

        await message.delete().catch(error => console.log(error))

        var mentionedUser;
        var mention = args[0];
        if (args[0]) {
            try {
                if (message.mentions.repliedUser) {
                    if (mention.startsWith('<@') && mention.endsWith('>')) {
                        mention = mention.slice(2, -1);

                        if (mention.startsWith('!')) {
                            mention = mention.slice(1);
                        }
                        mentionedUser = await message.guild.members.fetch(mention)
                    } else {
                        mentionedUser = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0])
                    }
                } else {
                    mentionedUser = message.mentions.members.first() || await message.guild.members.fetch(args[0])
                }
                if (!mentionedUser) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!mentionedUser) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else return message.channel.send(`<@${message.author.id}>,` + "You Need To Mention A User!");

        let msgtosend = args
        msgtosend.shift();

        if (!msgtosend) return message.channel.send(`<@${message.author.id}>` + "You Need To Provide A Text To DM Others!")

        const dmEmbed = new Discord.MessageEmbed()
            .setColor(0x00FFFF)
            .setThumbnail(bot.user.displayAvatarURL())
            .setDescription(`:loudspeaker: **You just received a new direct message!**`)
            .addField(`:speaking_head: **From:**`, `═══════ \n  __${message.author.tag}__ \n **--------------------------------------------**`)
            .addField(`:speech_balloon: **Message:**`, `═════════ \n  ${msgtosend.join(" ")}`)
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
        var blocked = false;
        await mentionedUser.send({
            embeds: [dmEmbed]
        }).catch(error => {
            blocked = true;
        }).finally(async () => {
            if (blocked) {
                const errEmbed = new Discord.MessageEmbed();
                errEmbed.setColor(0xFF0000)
                errEmbed.setDescription(`❌ I was unable to dm that User! `);
                return message.channel.send({
                    embeds: [errEmbed]
                });
            } else {
                var sentEmbed = new Discord.MessageEmbed()
                    .setColor(0x00FFFF)
                    .setDescription(`<:Bluecheckmark:754538270028726342> DM Sent! `);
                await message.channel.send({
                    embeds: [sentEmbed]
                });
            }
        })

    }
}