module.exports = (bot, Discord, Server, serverUser,youtube, guild) => {

    console.log(`I have been removed from: ${guild.name} (id: ${guild.id}) , ${guild.memberCount} members!`);
    bot.user.setPresence({
        activities: [{
            // name: `on ${bot.guilds.cache.size} servers | =help`,
            name: `=help`,
            type: 'PLAYING'
        }],
        status: 'idle'
    });

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