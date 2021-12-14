module.exports = (bot, Discord, Server, serverUser,youtube, member) => {
        serverUser.findOne({
                muteStatus: "Muted",
                serverID: member.guild.id,
                userID: member.id
        }, async (err, user) => {
                if (err) console.log(err);
                // console.log(user)

                if (!user) return;
                var latestMute = user.mutes[user.mutes.length - 1]
                console.log(latestMute.duration + latestMute.date > Date.now())
                if (latestMute.duration + latestMute.date > Date.now()) {
                        var g = bot.guilds.cache.get(user.serverID)
                        // console.log(`g ` + g)
                        var u = await g.members.fetch(user.userID)
                        var muterole = g.roles.cache.find(role => role.name === 'Muted');
                        u.roles.add(muterole)
                        var remainingTime = Date.now() - latestMute.duration + latestMute.date
                        // console.log(`remaining ` + remainingTime)
                }
        })
}