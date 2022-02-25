const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js");
const getMember = require("../../utils/getMember.js");

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
    options: [{
        name: "user",
        description: "User who is supposed to get the DM",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "user"
    },
    {
        name: "message",
        description: "Message to be sent to the user",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }
    ],
    run: async (bot, message, args, options, author) => {
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
            noperm1.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return send(message, {
                embeds: [noperm1],
                ephemeral: true
            }, true);
        }
        if (message.type !== "APPLICATION_COMMAND") {
            await message.delete().catch(error => console.log(error))
        }
        var mentionedUser = await getMember(bot, args, options, message, author, false, false, 0, false)

        if (!mentionedUser) return;

        let msgtosend = options[1]
        if (!msgtosend) return send(message, { content: `You Need To Provide A Text To DM Others!` }, false);


        const dmEmbed = new Discord.MessageEmbed()
            .setColor(0x00FFFF)
            .setThumbnail(bot.user.displayAvatarURL())
            .setDescription(`:loudspeaker: **You just received a new direct message!**`)
            .addField(`:speaking_head: **From:**`, `═══════ \n  __${author.tag}__ \n **--------------------------------------------**`)
            .addField(`:speech_balloon: **Message:**`, `═════════ \n  ${msgtosend}`)
            .setFooter({ text: author.tag, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        var blocked = false;
        await mentionedUser.send({
            embeds: [dmEmbed],
        }).catch(error => {
            if (error.code === 50007) {
                blocked = true;
            } else {
                console.log(error)
            }
        }).finally(async () => {
            if (blocked) {
                const errEmbed = new Discord.MessageEmbed();
                errEmbed.setColor(0xFF0000)
                errEmbed.setDescription(`❌ I was unable to dm that User! `);
                return send(message, {
                    embeds: [errEmbed]
                }, false);
            } else {
                var sentEmbed = new Discord.MessageEmbed()
                    .setColor(0x00FFFF)
                    .setDescription(`<:Bluecheckmark:754538270028726342> DM Sent! `);
                send(message, {
                    embeds: [sentEmbed]
                }, false);
            }
        })

    }
}