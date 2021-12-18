const Discord = require("discord.js");
const ServerUser = require("../../model/serverUser.js")
const server = require("../../model/server.js")

module.exports = {
    name: "clearwarns",
    aliases: ["clearwarn"],
    category: "Moderation",
    accessableby: "Manage Server",
    description: "Clear all warnings for a user at once.",
    usage: "=clearwarn <mention/userid>",
    example: "=clearwarn @Real Warrior#5085",
    permission: ["ADMINISTRATOR"],
    botreq: ["Embed Links"],

    run: async (bot, message, args) => {


        //permissions-

        //main code-

        //defining member who will get a warn and fetching id of him so member will be id of user mentioned
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
                        member = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(args[0]).catch(error => console.log())
                    }
                } else {
                    member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(error => console.log())
                }
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            } catch (error) {
                if (!member) return message.channel.send(`<@${message.author.id}>, Invalid User!`);
            }
        } else {
            if (!member) return message.channel.send(`<@${message.author.id}> , You Need To Mention A User!`);
        }

        //storing data in db according to total warns, member warned, guild id


        const embed = new Discord.MessageEmbed()

        ServerUser.findOne({
            serverID: message.guild.id,
            userID: member.id,

        }, async (err, user) => {
            if (err) console.log(err);
            if (!user || user.warns.length == 0) {
                embed.setColor(0xFF0000)
                embed.setDescription("❌ No Warnings!")
                return message.channel.send({ embeds: [embed] });
            }

            user.warns = []
            await user.save().catch(e => console.log(e));

            embed.setColor(0x00FFFF)
            embed.setDescription(` <:Bluecheckmark:754538270028726342> Cleared Warns of ${member}`);
            message.channel.send({ embeds: [embed] });
        })


    }
}