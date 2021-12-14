const Discord = require("discord.js");

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

    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
            const embed = new Discord.MessageEmbed();
            embed.setColor(0xff0000);
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE ROLES]");
            return message.channel.send({ embeds: [embed] });
        }

        var colorname = "#000000"
        var argss = args
        var rolename = args.join(" ")
        // let role1 = (args[args.length - 1])
        if (!rolename) return message.reply("Please provide a name for creating a role.")
        if (rolename.length > 100) return message.reply(`For role name maximum character is 100`)
        if (args[args.length - 1].startsWith("#")) {
            colorname = args[args.length - 1]
            if (colorname.length > 6) return message.reply(`Only 6 digits are allowed in Hex Color Code`)
            argss.pop()
            rolename = argss.join(" ")
        }
        message.guild.roles.create({
            name: rolename,
            color: colorname,
            reason: `Created by ${message.author.tag}`,
        })
            .then((role) => {
                message.channel.send(
                    `<:Bluecheckmark:754538270028726342> ${role.name} role was created.`
                );
            })
            .catch((err) => console.log(err));
    }

}
