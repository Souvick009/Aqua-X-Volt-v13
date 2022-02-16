const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

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
    options: [{
        name: "user",
        description: "The user whose nickname will be changed",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "new_nickname",
        description: "The new nickname to be given to the user",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has(["MANAGE_NICKNAMES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Nicknames]")
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, false)
        }

        var member = await getMember(bot, args, options, message, author, false, false, 0, false)
        if (!member) return;


        let nickname = options[1]

        if (!nickname) return send(message, { content: `Please provide a nickname!` }, true)

        if (nickname.length > 32) {
            return send(message, { content: `The nickname must be 32 or fewer in length` }, true)
        }

        var memberRole;
        try {
            memberRole = member.roles.highest.rawPosition
        } catch (error) {
            send(message, { content: `Something gone wrong!` }, true)
        }

        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")
        if (!botrole) return send(message, { content: ` It seems that my role isn't assigned to me, re-invite me to fix it or make a role named "Aqua X Volt (Beta testing)" and assign it to me.` }, true)

        if (member.user.id === message.guild.ownerID) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`❌ ${member.user.tag} seems to be the owner of this server, I can't change his/her's nickname`)
            embed.setColor(0xff4a1f)
            return send(message, { embeds: [embed] }, true)
        }

        if (memberRole > botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`❌ Please Check My Permission, Maybe my role isn't higher enough in order to change nickname of ${member.user.tag}`)
            embed.setColor(0xff4a1f)
            return send(message, { embeds: [embed] }, true)
        }

        if (message.type == "DEFAULT" || message.type == "REPLY") {
            await message.delete().catch(error => console.log(error))
        }

        member.setNickname(nickname)

        const embed1 = new Discord.MessageEmbed()
        embed1.setColor(0x00FFFF)
        embed1.setDescription(`<a:zzz_tick:853390761474129971> Set ${member.user.tag}'s nickname to ${nickname}.`)
        return send(message, { embeds: [embed1] }, false)
    }
}
