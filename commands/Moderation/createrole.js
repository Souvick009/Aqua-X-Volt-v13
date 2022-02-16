const Discord = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {

    name: "createrole",
    aliases: ["cr"],
    accessableby: "Manage Roles",
    description: "Create a Role In The Server",
    category: "Moderation",
    usage: "=createrole [role name] <hex color code> (Note:- Hex Color code is optional)",
    example: "=createrole Members , =createrole Winners #000fff",
    permission: ["MANAGE_ROLES"],
    botreq: "Embed Links, Manage Roles",
    options: [{
        name: "name",
        description: "Name of the role to be create",
        required: true,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    },
    {
        name: "color",
        description: "Color of the role to be created, default to default grey color",
        required: false,
        type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }
    ],
    run: async (bot, message, args, options, author) => {


        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
            const embed = new Discord.MessageEmbed();
            embed.setColor(0xff0000);
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE ROLES]");
            return send(message, {
                embeds: [embed],
                ephemeral: true
            }, false);
        }
        let rolename;
        let input;
        var colorname = "#000000"
        if (message.type == "APPLICATION_COMMAND") {

            rolename = options[0]
            input = options[1]
            if (input) {
                if (input.startsWith("#")) {
                    console.log(input)
                    colorname = input
                    if (colorname.length > 7 || colorname.length < 7) return send(message, { content: `Only 6 digits are allowed in Hex Color Code` }, true, true)
                } else {
                    return send(message, { content: `Only Hex Codes Are Allowed` }, true)
                }
            } else {
                colorname = "#000000"
            }
        } else {
            input = "#000000"
            var argss = args
            rolename = args.join(" ")
            if (args[args.length - 1].startsWith("#")) {
                input = args[args.length - 1]
                if (input.length > 7) return message.reply(`Only 6 digits are allowed in Hex Color Code`)
                argss.pop()
                rolename = argss.join(" ")
            }
        }
        
        // let role1 = (args[args.length - 1])
        if (!rolename) return send(message, { content: "Please provide a name for creating a role." }, true)

        if (rolename.length > 100) return send(message, { content: `For role name maximum character is 100` },
            true, true)


        message.guild.roles.create({
            name: rolename,
            color: input,
            reason: `Created by ${author.tag}`,
        })
            .then((role) => {
                send(message, { content: `<:Bluecheckmark:754538270028726342> ${role.name} role was created.` }, false);
            })
            .catch((err) => console.log(err));
    }

}