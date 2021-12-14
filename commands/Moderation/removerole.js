const Discord = require("discord.js");

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
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
            const embed1 = new Discord.MessageEmbed()
            embed1.setColor(0xFF0000)
            embed1.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE ROLES]")
            return message.channel.send({ embeds: [embed1] })
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const noperm = new Discord.MessageEmbed()
            noperm.setColor(0xFF0000)
            noperm.setDescription(`❌ Check My Permissions. [Missing Permissions:- MANAGE MESSAGES]`)
            return message.channel.send({ embeds: [noperm] });
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const noperm1 = new Discord.MessageEmbed()
            noperm1.setColor(0xFF0000)
            noperm1.setDescription(`❌ I don't have permission in this channel! [Missing Permissions:- MANAGE MESSAGES]`)
            return message.channel.send({ embeds: [noperm1] });
        }

        await message.delete().catch(error => console.log(error))



        var rmember;
        var mention = args[0];
        if (args[0]) {
            try {
                if (message.mentions.repliedUser) {
                    if (mention.startsWith('<@') && mention.endsWith('>')) {
                        mention = mention.slice(2, -1);

                        if (mention.startsWith('!')) {
                            mention = mention.slice(1);
                        }
                        rmember = await message.guild.members.fetch(mention)
                    } else {
                        rmember = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0]).catch(error => console.log())
                    }
                } else {
                    rmember = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(error => console.log())
                }
                if (!rmember) return message.reply("Invalid User!");
            } catch (error) {
                if (!rmember) return message.reply("Invalid User!");
            }
        } else {
            if (!rmember) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }

        let role1 = args
        role1.shift()
        let role2 = role1.join(" ")
        let role = message.guild.roles.cache.find(r => r.name == role2) || message.mentions.roles.first() || message.guild.roles.cache.get(role2)
        if (!role) return message.channel.send("Please provide a role to remove from the said user.")
        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")
        if (role.rawPosition > botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to remove a role from the user!")
            embed.setColor(0xff4a1f)
            return await message.channel.send({ embeds: [embed] })
        }

        const msgsend = new Discord.MessageEmbed()
        msgsend.setColor(0x00FFFF)
        msgsend.setDescription(`<:Bluecheckmark:754538270028726342> The role, ${role.name}, has been removed from ${rmember.displayName}`)

        if (!rmember.roles.cache.has(role.id)) {
            return message.channel.send(`${rmember.displayName}, don't have the role!`)
        } else {
            if (rmember.roles.remove(role.id).catch(e => console.log(e.message)))
                return message.channel.send({ embeds: [msgsend] })

        }
    }
}