const { MessageEmbed } = require("discord.js");
const send = require("../../utils/sendMessage.js")
const getMember = require("../../utils/getMember.js");

module.exports = {

    name: "banner",
    aliases: [],
    accessableby: "MANAGE_MESSAGES",
    description: "Returns user's banner",
    category: "Info",
    usage: "=banner <user>",
    example: "=banner @Real Warrior#5085",
    permission: ["MANAGE_MESSAGES"],
    botreq: ["EMBED_LINKS"],
    options: [{
        name: "user",
        description: "For which user you want the information?",
        required: false,
        type: 6, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
        req: "string"
    }],
    run: async (bot, message, args, options, author) => {

        var member = await getMember(bot, args, options, message, author, true, false, 0, false)
        // const member = await message.guild.members.fetch(member1.id).catch(error => console.log())
        if (!member) return;

        var hexes = member.displayHexColor
        var image = await bot.users.fetch(member.id, { force: true })
        // Member variables
        const embed = new MessageEmbed()

        if (image.banner) {
            embed.setTitle("Banner")
            embed.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
            embed.setColor(hexes === '#000000' ? '#ffffff' : hexes)
            embed.setImage(image.bannerURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }))
            embed.setTimestamp()
            embed.setFooter({ text: "Searched by " + author.username, iconURL: author.displayAvatarURL() })
        } else {
            embed.setDescription(`❌ This user doesn't have a banner`)
            embed.setColor(0xFF0000)
        }

        send(message, { embeds: [embed] }, true);

    }
}
