const Discord = require("discord.js");
const serverUser = require("../../model/serverUser.js")
const perms = Discord.Permissions.FLAGS
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");


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
    options: [{
        name: "user",
        description: "Which user should be warned",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "reason",
        description: "Reason why the user is being warned",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }],
    run: async (bot, message, args, options, author) => {

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

        //defining member who will get a warn and fetching id of him so member will be id of user mentioned
        var member = await getMember(bot, args, options, message, author, false, false, 0, false)

        if (!member) return;
        if (member.id == "721460877005422634") return send(message, { content: "You can't warn me" }, true)
        //storing data in db according to total warns, member warned, guild id
        const Createdd = Date.now()
        let reason = options[1]

        if (member.permissions.has(perms.ADMINISTRATOR)) return send(message, { content: `❌ You can not warn an Admin. This person seems to be an Admin of this server.` }, true)

        if (!reason) return send(message, { content: `<@${author.id}> , You didn't specify a reason!` }, true)



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
                    administrator: author.tag,
                    reason: reason,
                    date: Createdd
                };
                newUser.warns.push(warnObj);
                await newUser.save().catch(e => console.log(e));

            } else if (user) {
                var warnObj = {
                    administrator: author.tag,
                    reason: reason,
                    date: Createdd
                };
                user.warns.push(warnObj);
                await user.save().catch(e => console.log(e));
            }
        })

        if (message.type !== "APPLICATION_COMMAND") {
            await message.delete().catch(error => console.log(error));
        }

        const embed = new Discord.MessageEmbed()
        embed.setColor(0x00FFFF)
        embed.setDescription(`<:Bluecheckmark:754538270028726342> ***${member} has been warned*** | **${reason}**`);
        send(message, {
            embeds: [embed]
        }, false);

        //Notifing warnings through DM
        // const mention = message.mentions.members.first();

        embed.setColor(0x00FFFF)
        embed.setDescription(`<:Bluecheckmark:754538270028726342> ***You have been warned in ${message.guild.name}*** | **${reason}**`);
        var dmUser = await bot.users.fetch(member.id)
        await dmUser.send({
            embeds: [embed],
        }).catch(error => {
            if (error.code === 50007) {
                return
            } else {
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