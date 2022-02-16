module.exports = async (bot, Discord, Server, serverUser, youtube, guild) => {

    console.log(`I have been removed from: ${guild.name} (id: ${guild.id}) , ${guild.memberCount} members!`);
    var server = await bot.guilds.fetch("722356448960577538");
    var channel = await server.channels.cache.get("934012022759256095")

    var embed = new Discord.MessageEmbed()
    embed.setAuthor({ name: "Removed From A Server", iconURL: bot.user.displayAvatarURL() })
    embed.setDescription(`I have been removed from: ${guild.name} (id: ${guild.id}) , ${guild.memberCount} members!`)
    embed.setColor(0xFF0000)
    embed.setFooter(`Total Servers: ${bot.guilds.cache.size}`)
    channel.send({ embeds: [embed] })

    Server.findOneAndDelete({
        serverID: guild.id,
    })
    serverUser.findOneAndDelete({
        serverID: guild.id,
    })
    Server.deleteMany({ serverID: guild.id }, function (err) {
        if (err) console.log("Server Db deletion error: " + err);
        console.log(`Server Db Successful deletion of ${guild.name}`);
    });
    serverUser.deleteMany({ serverID: guild.id }, function (err) {
        if (err) console.log("ServerUser Db deletion error: " + err);
        console.log(`ServerUser Db Successful deletion of ${guild.name}`);
    });
};