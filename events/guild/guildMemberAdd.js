module.exports = (bot, Discord, Server, serverUser, youtube, member) => {
        serverUser.findOne({
                muteStatus: "Muted",
                serverID: member.guild.id,
                userID: member.id
        }, async (err, user) => {
                if (err) console.log(err);
                // console.log(user)

                if (!user) return;
                var latestMute = user.mutes[user.mutes.length - 1]
                if (latestMute.duration !== "perm") {
                        if (latestMute.duration + latestMute.date > Date.now()) {
                                var g = bot.guilds.cache.get(user.serverID)
                                try {
                                        var u = await g.members.fetch(user.userID)
                                } catch (error) {
                                        return
                                }
                                var muterole = g.roles.cache.find(role => role.name === 'Muted');
                                u.roles.add(muterole)
                        }
                } else if (latestMute.duration === "perm") {
                        var g = bot.guilds.cache.get(user.serverID)
                        try {
                                var u = await g.members.fetch(user.userID)
                        } catch (error) {
                                // console.log(error)
                                return
                        }
                        var muterole = g.roles.cache.find(role => role.name === 'Muted');
                        if (u.roles.cache.some(r => r.name === "Muted")) return
                        u.roles.add(muterole).catch(error => console.log(error))
                }
        })
}