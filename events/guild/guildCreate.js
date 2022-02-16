module.exports = (bot, Discord, Server, serverUser,youtube, guild) => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setPresence({
        activities: [{
            // name: `on ${bot.guilds.cache.size} servers | =help`,
            name: `=help`,
            type: 'PLAYING'
        }],
        status: 'idle'
    });
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