const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

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
    options: [{
        name: "user",
        description: "user to be kicked",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "reason",
        description: "Reason of why the user will be kicked",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- KICK MEMBERS]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, false)
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const noperm = new Discord.MessageEmbed()
            noperm.setColor(0xFF0000)
            noperm.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return send(message, {
                embeds: [noperm],
                ephemeral: true
            }, false);
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const noperm1 = new Discord.MessageEmbed()
            noperm1.setColor(0xFF0000)
            noperm1.setDescription(`❌ I don't have permission in this channel! [Missing Permissions:- MANAGE MESSAGES]`)
            return send(message, {
                embeds: [noperm1],
                ephemeral: true
            }, false);
        }

        if (message.type !== "APPLICATION_COMMAND") {
            await message.delete().catch(error => console.log(error))
        }

        var member = await getMember(bot, args, options, message, author, false, false, 0, false)

        if (!member) return

        const user = member.user
        var blocked = false
        if (member.permissions.has("ADMINISTRATOR")) {
            const embed1 = new Discord.MessageEmbed()
            embed1.setColor(0xFF0000)
            embed1.setDescription("❌ You can not kick an Admin.This person seems to be an Admin of this server.")
            return send(message, { embeds: [embed1] }, false)
        }
        //defining member who will get a warn and fetching id of him so member will be id of user mentioned

        var memberRole;
        try {
            memberRole = member.roles.highest
        } catch (error) {
            return send(message, { content: `Something gone wrong!` }, true)
        }

        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")
        // console.log(memberRole, "\n \n \n ", botrole)
        if (memberRole.rawPosition > botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to kick the user!")
            embed.setColor(0xff4a1f)
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, false)
        }

        let reason = options[1]
        if (!reason) {
            reason = "None"
        }

        async function sendDm() {
            const msg = "You got kicked from " + message.guild.name + "\n" + "By: " + author.username + "\n" + "Reason: " + reason
            const embed1 = new Discord.MessageEmbed()
            embed1.setColor(0x00FFFF)
            embed1.setThumbnail(bot.user.displayAvatarURL())
            embed1.setDescription(msg);
            embed1.setFooter({ text: author.tag, iconURL: author.displayAvatarURL() })
            embed1.setTimestamp()
            const embed2 = new Discord.MessageEmbed();
            var mentionedUser = bot.users.cache.get(member.id)
            await mentionedUser.send({
                embeds: [embed1],
            }).catch(error => {
                if (error.code === 50007) {
                    return
                } else {
                    console.log(error);
                }
            })
        }

        if (member) {
            const guildMember = message.guild.members.cache.get(member.id);
            if (guildMember) {
                sendDm()
                setTimeout(kick, 1000)
            } else {
                send(message, { content: `<@${author.id}> That user isn\'t in the this guild` }, false)
            }

        } else {
            send(message, { content: `<@${author.id}> You need to specify a person!` }, false)
        }
        function kick() {
            member.kick('You Were Kicked From The Server!').then(() => {
                {
                    const embed2 = new Discord.MessageEmbed()
                    embed2.setColor(0x00FFFF)
                    embed2.setDescription(`<:Bluecheckmark:754538270028726342> ***Successfully Kicked ${user.username}*** | **${reason}**`)
                    return send(message, { embeds: [embed2] }, false)
                }

            }).catch(err => {
                send(message, { content: `<@${author.id}> I was unable to kick the member` }, false);
            });
        }
    }
}