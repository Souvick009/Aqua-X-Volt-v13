module.exports = (bot, Discord, Server, serverUser, youtube) => {

    console.log(`${bot.user.username} is Online!`);
    // bot.guilds.cache.forEach(guild => {
    //     console.log(`${guild.name} | ${guild.id} | ${guild.memberCount} members!`);
    // })
    bot.user.setPresence({
        activities: [{
            // name: `on ${bot.guilds.cache.size} servers | =help`,
            name: `=help`,
            type: 'PLAYING'
        }],
        status: 'idle'
    });
    serverUser.find({
        muteStatus: "Muted",
    }, async (err, users) => {
        if (err) console.log(err);
        if (!users || users.length == 0) return;

        users.forEach(async (user) => {
            var latestMute = user.mutes[user.mutes.length - 1]
            if (latestMute.duration !== "perm") {
                // agar duration Permanent nahi hua toh
                if (latestMute.duration + latestMute.date < Date.now()) {
                    // agar muted duration over hogya ho toh
                    var g = bot.guilds.cache.get(user.serverID)
                    try {
                        var u = await g.members.fetch(user.userID)
                        // console.log(user.userID)
                    } catch (error) {
                        user.muteStatus = "Unmuted"
                        await user.save().catch(e => console.log(e));
                        return console.log(error)
                    }
                    var muterole = g.roles.cache.find(role => role.name === 'Muted');
                    u.roles.remove(muterole).catch(error => console.log(error))
                    user.muteStatus = "Unmuted"
                    await user.save().catch(e => console.log(e));
                } else if (latestMute.duration + latestMute.date > Date.now()) {
                    // agar muted duration over nahi hua ho toh
                    var g = bot.guilds.cache.get(user.serverID)
                    try {
                        var u = await g.members.fetch(user.userID)
                    } catch (error) {
                        var timeLength = latestMute.duration + latestMute.date - Date.now()
                        setTimeout(async () => {
                            user.muteStatus = "Unmuted"
                            await user.save().catch(e => console.log(e));
                        }, timeLength)
                        return console.log(error)
                    }
                    var muterole = g.roles.cache.find(role => role.name === 'Muted');
                    if (u.roles.cache.some(r => r.name === "Muted")) {
                        // agar member ke pass muted role ho toh
                        var timeLength = latestMute.duration + latestMute.date - Date.now()
                        setTimeout(async () => {
                            await u.roles.remove(muterole).catch(error => console.log(error))
                            user.muteStatus = "Unmuted"
                            await user.save().catch(e => console.log(e));
                        }, timeLength)

                    } else if (!u.roles.cache.some(r => r.name === "Muted")) {
                        // agar member ke pass muted role nahi ho toh
                        var timeLength = latestMute.duration + latestMute.date - Date.now()
                        u.roles.add(muterole).catch(error => console.log(error))
                        setTimeout(async () => {
                            await u.roles.remove(muterole).catch(error => console.log(error))
                            user.muteStatus = "Unmuted"
                            await user.save().catch(e => console.log(e));
                        }, timeLength)
                    }
                }
            } else if (latestMute.duration === "perm") {
                // agar duration Permanent hua toh
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
    })


    async function subCounter() {
        bot.guilds.cache.forEach(guild => {
            Server.findOne({
                serverID: guild.id
            }, async (err, data) => {
                if (err) console.log(err);
                if (!data) return
                if (data.length == 0) return
                if (!data.subCounterChannel || data.subCounterChannel == "") return
                try {
                    var channel = await bot.channels.fetch(data.subCounterChannel)
                } catch (error) {
                    data.subCounterChannel = ""
                    data.ytChannel = ""
                    await data.save().catch(e => console.log(e));
                    return
                }

                var yt = data.ytChannel
                var channelName = channel.name

                const searchChannel = await youtube.search(yt, {
                    type: "channel", // video | playlist | channel | all
                });

                var totalSubs;
                try {
                    totalSubs = await searchChannel[0].subscriberCount
                } catch (error) {
                    return
                }


                let subs;

                try {
                    subs = totalSubs.split(" ")[0]
                } catch (error) {
                    return
                }

                var name = channelName.split(" ")[0]
                channel.edit({ name: `${name} ${subs}` })
                    .catch(console.error);
            })
        })
    }

    setInterval(subCounter, 1800000)
}