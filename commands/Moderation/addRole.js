const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");
const getRole = require("../../utils/getRole.js")
module.exports = {
    name: "addrole",
    aliases: ["ar"],
    accessableby: "Manage Roles",
    description: "Adds a role to the user.",
    category: "Moderation",
    usage: "=addrole <user> <role/role name> __(Note: The role name should be case sensitive)__",
    example: "=addrole @Real Warrior @moderators , =addrole @Yashu @Owner",
    cooldown: 5,
    permission: ["MANAGE_ROLES"],
    botreq: "Embed Links, Manage Roles, Manage Message",
    options: [{
        name: "user",
        description: "The user to get the role",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    },
    {
        name: "role",
        description: "The role to be added to the user",
        required: true,
        type: 8, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "reason"
    }
    ],
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

        const rmember = await getMember(bot, args, options, message, author, false, false, 0, false)
        if (!rmember) return

        let role2 = options[1]

        var role = await getRole(message, role2)

        if (!role) return send(message, { content: "Please provide a role to add to the said user." }, true)
        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")

        if (role.rawPosition >= botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to give a role to the user!")
            embed.setColor(0xff4a1f)
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        if (role.managed) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to give a role to the user!")
            embed.setColor(0xff4a1f)
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, true)
        }

        const msgsend = new Discord.MessageEmbed()
        msgsend.setColor(0x00FFFF)
        msgsend.setDescription(`<:Bluecheckmark:754538270028726342> The role, ${role.name}, has been added to ${rmember.displayName}`)

        if (message.type == "DEFAULT" || message.type == "REPLY") {
            await message.delete().catch(error => console.log(error))
        }

        if (rmember.roles.cache.has(role.id)) {
            return send(message, { content: `${rmember.displayName}, already has the role!` }, false)
        } else {
            if (rmember.roles.add(role.id).catch(e => console.log(e.message)))
                return send(message, {
                    embeds: [msgsend]
                })
        }

    }

}