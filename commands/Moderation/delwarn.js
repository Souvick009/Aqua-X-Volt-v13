const Discord = require("discord.js");
const serverUser = require("../../model/serverUser.js")
const server = require("../../model/server.js")
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");


module.exports = {
    name: "delwarn",
    aliases: [],
    accessableby: "Manage Messages",
    description: "Delete a single warning for a member.",
    usage: "=delwarn <mention/userid> <Number of a warning>",
    category: "Moderation",
    example: "=delwarn @Real Warrior#5085 1",
    permission: ["MANAGE_MESSAGES"],
    botreq: ["Embed Links"],
    options: [{
        name: "user",
        description: "The user for which warn is deleted",
        required: true,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }, {
        name: "index",
        description: "index of warn to be deleted",
        required: true,
        type: 4, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "integer"
    }],
    run: async (bot, message, args, options, author) => {

        const embed = new Discord.MessageEmbed()

        //permissions

        //main code
        //defining member who will get a warn and fetching id of him so member will be id of user mentioned
        var member = await getMember(bot, args, options, message, author, false, false, 0, false)

        if (!member) return

        //storing data in db according to total warns, member warned, guild id

        input = options[1]

        if (!input) {
            embed.setColor(0xFF0000)
            embed.setDescription("❌ You need to specify which warnings you wanna delete in number!")
            return send(message, { embeds: [embed] }, true);
        }

        if (isNaN(input)) {
            embed.setColor(0xFF0000)
            embed.setDescription("❌ You need to specify which warnings you wanna delete in number!")
            return send(message, { embeds: [embed] }, true);
        }

        number = parseInt(input) - 1;

        serverUser.findOne({
            serverID: message.guild.id,
            userID: member.id,

        }, async (err, user) => {
            if (err) console.log(err);

            if (!user || user.warns.length == 0) {
                embed.setColor(0xFF0000)
                embed.setDescription("❌ This user has no warns!")
                return send(message, { embeds: [embed] }, true);
            }

            user.warns.splice(number, 1)
            await user.save().catch(e => console.log(e));
            embed.setColor(0x00FFFF)
            embed.setDescription(` <:Bluecheckmark:754538270028726342> Deleted 1 Warn of ${member}`);
            send(message, { embeds: [embed] }, true);
        })
    }
}