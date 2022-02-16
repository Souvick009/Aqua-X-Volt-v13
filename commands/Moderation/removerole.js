const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");
const getRole = require("../../utils/getRole.js")

module.exports = {
    name: "removerole",
    aliases: ["rr"],
    accessableby: "Manage Roles",
    description: "Removes a role from the user.",
    usage: "=removerole <user> <role> __(Note: The role name should be case sensitive)__",
    category: "Moderation",
    example: "=removerole @Real Warrior @moderators , =removerole @Yashu @Owner",
    cooldown: 5,
    permission: ["MANAGE_ROLES"],
    botreq: "Embed Links, Manage Roles, Manage Messages",
    options: [{
        name: "user",
        description: "From the user, role should be removed",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    },
    {
        name: "role",
        description: "The role that should be removed",
        required: true,
        type: 8, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {

        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
            const embed1 = new Discord.MessageEmbed()
            embed1.setColor(0xFF0000)
            embed1.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE ROLES]")
            return send(message, {
                embeds: [embed1],
                ephemeral: true
            }, true)
        }

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
            noperm1.setDescription(`❌ I don't have permission in this channel! [Missing Permissions:- MANAGE MESSAGES]`)
            return send(message, {
                embeds: [noperm1],
                ephemeral: true
            }, true);
        }

        if (message.type !== "APPLICATION_COMMAND") {
            await message.delete().catch(error => console.log(error))
        }

        var member = await getMember(bot, args, options, message, author, false, false, 0, false)
        if (!member) return;


        let role2 = options[1]
        var role = await getRole(message, role2)
        if (!role) return send(message, { content: "Please provide a role to remove from the said user." }, false)
        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")

        const embed = new Discord.MessageEmbed()
        embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to remove a role from the user!")
        embed.setColor(0xff4a1f)

        if (role.rawPosition >= botrole.rawPosition) {
            return send(message, { embeds: [embed] }, false)
        }

        const msgsend = new Discord.MessageEmbed()
        msgsend.setColor(0x00FFFF)
        msgsend.setDescription(`<:Bluecheckmark:754538270028726342> The role, ${role.name}, has been removed from ${member.displayName}`)

        if (!member.roles.cache.has(role.id)) {
            return send(message, { content: `${member.displayName}, don't have the role!` }, false)
        } else {
            // if (member.roles.remove(role.id).catch(e => console.log(e.message)))
            try {
                member.roles.remove(role.id)
            } catch (error) {
                send(message, { embeds: embed }, false)
            }
            return send(message, { embeds: [msgsend] }, false)
        }


    }
}