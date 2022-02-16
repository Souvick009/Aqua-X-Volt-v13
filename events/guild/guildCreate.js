module.exports = async (bot, Discord, Server, serverUser,youtube, guild) => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    var server = await bot.guilds.fetch("722356448960577538");
    var channel = await server.channels.cache.get("934012022759256095")

    var embed = new Discord.MessageEmbed()
    embed.setAuthor({ name: "Added In A Server", iconURL: bot.user.displayAvatarURL() })
    embed.setDescription(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
    embed.setColor(0xaf89d)
    embed.setFooter(`Total Servers: ${bot.guilds.cache.size}`)
    channel.send({ embeds: [embed] })

    Server.findOne({
        serverID: guild.id
    }, async (err, serverGuild) => {
        if (err) console.log(err);

        if (!serverGuild) {
            serverGuild = new Server({
                serverID: guild.id
            })
            await serverGuild.save().catch(e => console.log(e));
        }
    })
}