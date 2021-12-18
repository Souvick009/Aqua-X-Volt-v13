const Discord = require("discord.js");


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
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has(["MANAGE_ROLES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Roles]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permission:- Manage Messages]")
            return message.channel.send({ embeds: [embed] })
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ I don't have permission in this channel! [Missing Permission:- Manage Messages]")
            return message.channel.send({ embeds: [embed] })
        }

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
                        rmember = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0])
                    }
                } else {
                    rmember = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[0]) || await message.guild.members.fetch(args[0])
                }
                rmember = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[0]) || await message.guild.members.fetch(args[0])
                if (!rmember) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!rmember) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else {
            if (!rmember) return message.channel.send("Please provide a user to add a role!")
        }

        let role1 = args
        role1.shift()
        let role2 = role1.join(" ")

        let role = message.guild.roles.cache.find(r => r.name == role2) || message.mentions.roles.first() || message.guild.roles.cache.get(role2)

        if (!role) return message.channel.send("Please provide a role to add to the said user.")
        const botrole = message.guild.roles.cache.find(r => r.name == "Aqua X Volt")

        if (role.rawPosition > botrole.rawPosition) {
            const embed = new Discord.MessageEmbed()
            embed.setDescription("Please Check My Permission, Maybe my role isn't higher enough in order to give a role to the user!")
            embed.setColor(0xff4a1f)
            return await message.channel.send({
                embeds: [embed]
            })
        }

        const msgsend = new Discord.MessageEmbed()
        msgsend.setColor(0x00FFFF)
        msgsend.setDescription(`<:Bluecheckmark:754538270028726342> The role, ${role.name}, has been added to ${rmember.displayName}`)

        if (rmember.roles.cache.has(role.id)) {
            return message.channel.send(`${rmember.displayName}, already has the role!`)
        } else {
            await message.delete().catch(error => console.log(error))
            if (rmember.roles.add(role.id).catch(e => console.log(e.message)))
                return message.channel.send({
                    embeds: [msgsend]
                })
        }

    }

}