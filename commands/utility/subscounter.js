const Discord = require("discord.js");
// const youtube = require('scrape-youtube').default;
const { Client } = require("youtubei");
const youtube = new Client();
const server = require("../../model/server.js")

module.exports = {
    name: "subscounter",
    aliases: ["subcounter"],
    accessableby: "Manage Channels",
    description: "Creates a live subscriber counter of a youtube channel (The channel will get updated in every 30 minutes)",
    category: "Utility",
    usage: "=subscounter <link of the youtube channel>",
    example: "=subscounter https://youtube.com/c/RakaZoneGaming",
    permission: ["MANAGE_CHANNELS"],
    botreq: "Embed Links, Manage Channel",
    run: async (bot, message, args) => {

        // async function test() {
        //     const channel = await youtube.search("https://www.youtube.com/channel/UCKjxMWG7UfGKH5WyiRORiqQ", {
        //         type: "channel", // video | playlist | channel | all
        //     });
        //     console.log(await channel[0].subscriberCount)
        // }

        // test()

        if (!message.guild.me.permissions.has(["MANAGE_CHANNELS"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE CHANNELS]")
            return message.channel.send({ embeds: [embed] });
        }

        if (!args[0]) return message.reply({ content: "Please send the channel link with it." })
        if (!args[0].toLowerCase().includes("https://youtube.com") && !args[0].toLowerCase().includes("https://www.youtube.com")) return message.reply("Invalid Link")

        const channel = await youtube.search(args[0], {
            type: "channel", // video | playlist | channel | all
        });

        if (!channel) return console.log(`Channel not found`)

        if (!channel[0]) return message.reply({ content: `Unable to load subscribers from the channel, try to replace \`https://youtube.com/c\` with \`https://youtube.com/channel\`` })

        let totalSubs = await channel[0].subscriberCount
        let subs;

        try {
            subs = totalSubs.split(" ")[0]
        } catch (error) {
            return message.reply({ content: "Something went wrong! Please try with a different link." })
        }

        async function vc() {
            server.findOne({
                serverID: message.guild.id,
            }, async (err, data) => {
                if (err) console.log(err);

                var subCounter = await message.guild.channels.create(`Subscribers: ${subs}`, {
                    type: 'GUILD_VOICE',
                    permissionOverwrites: [
                        {
                            id: message.channel.guild.roles.everyone,
                            deny: ["CONNECT"],
                        },
                        {
                            id: message.guild.me,
                            allow: ["CONNECT"],
                        }
                    ],
                }).catch(e => console.log(e));
                data.subCounterChannel = subCounter.id
                data.ytChannel = args[0]
                await data.save().catch(e => console.log(e));

                const embed = new Discord.MessageEmbed()
                embed.setTitle(`<:Bluecheckmark:754538270028726342> Subscriber Counter Created Successfully`)
                embed.setColor(0x00FFFF)
                embed.setDescription(`<#${subCounter.id}>`)
                return message.reply({ embeds: [embed] })

            })
        }
        vc()


    }
}
