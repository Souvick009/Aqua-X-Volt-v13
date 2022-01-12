const Discord = require("discord.js");
const ServerUser = require("../../model/serverUser.js")
const server = require("../../model/server.js")
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

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
    options: [{
        name: "user",
        description: "user to clear warnings",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {


        //permissions-

        //main code-

        //defining member who will get a warn and fetching id of him so member will be id of user mentioned

        var member = await getMember(bot, args, options, message, author, false, false, 0, false)

        if (!member) {
            return send(message, { content: `You Need To Mention A User!` }, true)
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
                return send(message, { embeds: [embed] }, false);
            }

            user.warns = []
            await user.save().catch(e => console.log(e));

            embed.setColor(0x00FFFF)
            embed.setDescription(` <:Bluecheckmark:754538270028726342> Cleared Warns of ${member}`);
            send(message, { embeds: [embed] }, false);
        })


    }
}