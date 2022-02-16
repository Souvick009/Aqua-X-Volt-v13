const serverUser = require("../../model/serverUser.js")
const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {
    name: "unmute",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Unmute a member so they can type or speak.",
    usage: "=unmute <user>",
    category: "Moderation",
    example: "=unmute @Real Warrior , =unmute @Yashu , =unmute @Shander ",
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links, Manage Roles, Manage Messages",
    options: [{
        name: "user",
        description: "User to be unmuted",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "reason",
        description: "Reason why the user is getting unmuted?",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has(["MANAGE_ROLES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Roles]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Messages]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Manage Messages]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        var embed = new Discord.MessageEmbed()

        var person = await getMember(bot, args, options, message, author, false, false, 0, false)

        if (!person) return;

        let reason = options[1]
        if (!reason) {
            reason = "none"
        }

        let muterole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muterole) return send(message, { content: "Couldn't find the mute role" }, true);
        
        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt");
        if (!botrole) return send(message, {
            content: `It seems that my role isn't assigned to me, re-invite me to fix it or make a role named "Aqua X Volt" and assign it to me.`,
            ephemeral: true
        }, true)

        if (muterole.rawPosition > botrole.rawPosition) {
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to remove a role from the user!")
            embed.setColor(0xff4a1f)
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }
        // console.log(person.roles.cache.some(r => r.name === "Muted"))

        if (!person.roles.cache.some(r => r.name === "Muted")) return send(message, { content: "The user is already unmuted" }, true)

        serverUser.findOne({
            serverID: message.guild.id,
            userID: person.id,

        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) {
                var newUser = new serverUser({
                    serverID: message.guild.id,
                    userID: person.id,
                })
                newUser.muteStatus = "Unmuted"

                var muteObj;

                var muteObj = {
                    administrator: author.tag,
                    reason: reason,
                    type: "Unmute",
                    date: Date.now(),
                    duration: 'None'
                };

                newUser.mutes.push(muteObj);
                await newUser.save().catch(e => console.log(e));
                person.roles.remove(muterole.id);
                embed.setColor(0x00FFFF)
                if (reason == "none") {
                    embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!**`);
                } else {
                    embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!** | ***${reason}***`);
                }
                send(message, {
                    embeds: [embed]
                }, false)
            } else if (user) {
                if (user.muteStatus === "Unmuted" && !person.roles.cache.some(r => r.name === "Muted")) {
                    return send(message, { content: "The user is already unmuted" }, true)
                } else {
                    var muteObj;

                    var muteObj = {
                        administrator: author.tag,
                        reason: reason,
                        type: "Unmute",
                        date: Date.now(),
                        duration: 'None'
                    };

                    user.mutes.push(muteObj);
                    user.muteStatus = "Unmuted"
                    await user.save().catch(e => console.log(e));
                    person.roles.remove(muterole.id);
                    embed.setColor(0x00FFFF)
                    if (reason == "none") {
                        embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!**`);
                    } else {
                        embed.setDescription(`<:Bluecheckmark:754538270028726342> **${person.user.tag} has been unmuted!** | ***${reason}***`);
                    }

                    if (message.type !== "APPLICATION_COMMAND") {
                        await message.delete().catch(error => console.log(error))
                    }
                    send(message, {
                        embeds: [embed]
                    }, false)
                }
            }
        })

    }
}