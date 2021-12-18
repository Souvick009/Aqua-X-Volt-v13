const Discord = require("discord.js");


module.exports = {

    name: "avatar",
    description: "Shows avatar of a user",
    usage: "<command | alias> || <@user>",
    example: "=avatar \n =avatar @Real Warrior",
    accessableby: "Manage Messages",
    cooldown: 5,
    category: "Fun",
    aliases: ["av"],
    permission: ["MANAGE_MESSAGES"],
    botreq: "Embed Links",
    run: async (bot, message, args) => {

        if (!message.member.permissions.has(["MANAGE_MESSAGES"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ You do not have permissions to check avatar of Server Members. Please contact a staff member.[Missing Permsission:- Manage Messages]")
            return message.channel.send(embed)
        }

        // var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        let memberUser;
        var member;
        var mention = args[0];
        if (args[0]) {
            try {
                if (message.mentions.repliedUser) {
                    if (mention.startsWith('<@') && mention.endsWith('>')) {
                        mention = mention.slice(2, -1);

                        if (mention.startsWith('!')) {
                            mention = mention.slice(1);
                        }
                        member = await message.guild.members.fetch(mention)
                    } else {
                        member = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0])
                    }
                    // console.log(member)
                } else {
                    member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
                }
                // console.log(args[0])
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else {
            memberUser = message.author
        }


        if (!args[0]) {
            memberUser = message.author
        } else {
            try {
                memberUser = member.user
            } catch (error) {
                return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        }

        var hexes;
        if (member) {
            hexes = member.displayHexColor
        } else {
            hexes = message.member.displayHexColor
        }

        let embed = new Discord.MessageEmbed()
            .setImage(memberUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setColor(hexes === '#000000' ? '#ffffff' : hexes)
            .setAuthor(memberUser.tag, memberUser.displayAvatarURL())
            .setTitle("Avatar")
            .setFooter("Searched by " + message.author.tag, message.author.displayAvatarURL());
        let msg = await message.channel.send({ content: "Generating avatar..." });


        try {
            message.channel.send({ embeds: [embed] })
        } catch (error) {
            console.log(embed)
        }


        msg.delete();
    }


}