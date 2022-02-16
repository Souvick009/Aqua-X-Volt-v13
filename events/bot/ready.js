module.exports = async (bot, Discord, Server, serverUser, youtube) => {

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

    // Bot off jaane ke baad jab online aayega tab bhi Muted member se role nahi hatega aur jinka unmute ka time hogye hai unse hatt jayega
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
                    var g = await bot.guilds.fetch(user.serverID)
                    // console.log(user.serverID + `\n next xD \n` + g)
                    try {
                        // console.log(user.userID)
                        var u = await g.members.fetch(user.userID)
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
                // console.log(user.serverID)
                var g = await bot.guilds.fetch(user.serverID)
                // console.log(g.members)
                try {
                    var u = await g.members.fetch(user.userID)
                    // console.log(u)
                } catch (error) {
                    return
                }
                var muterole = g.roles.cache.find(role => role.name === 'Muted');
                if (u.roles.cache.some(r => r.name === "Muted")) return
                u.roles.add(muterole).catch(error => console.log(error))
            }
        })
    })

    // bot online aane ke baad jo timedout users ka timeout duration over hogya hai unka db mai status hatadega
    serverUser.find({
        timeoutStatus: "Timedout",
    }, async (err, users) => {
        if (err) console.log(err);
        if (!users || users.length == 0) return;
        users.forEach(async (user) => {
            var latestTimeout = user.timeouts[user.timeouts.length - 1]
            if (!latestTimeout) return

            if (latestTimeout.duration + latestTimeout.date < Date.now()) {
                // agar timedout duration over hogya ho toh
                user.timeoutStatus = ""
                await user.save().catch(e => console.log(e));

            } else if (latestTimeout.duration + latestTimeout.date > Date.now()) {
                // agar timeout duration over nahi hua ho toh

                var timeLength = latestTimeout.duration + latestTimeout.date - Date.now()
                setTimeout(async () => {
                    user.timeoutStatus = ""
                    await user.save().catch(e => console.log(e));
                }, timeLength)
            }
        })
    })


    // // async function subCounter() {
    // //     bot.guilds.cache.forEach(guild => {
    // //         Server.findOne({
    // //             serverID: guild.id
    // //         }, async (err, data) => {
    // //             if (err) console.log(err);
    // //             if (!data) return
    // //             if (data.length == 0) return
    // //             if (!data.subCounterChannel || data.subCounterChannel == "") return
    // //             try {
    // //                 var channel = await bot.channels.fetch(data.subCounterChannel)
    // //             } catch (error) {
    // //                 data.subCounterChannel = ""
    // //                 data.ytChannel = ""
    // //                 await data.save().catch(e => console.log(e));
    // //                 return
    // //             }

    // //             var yt = data.ytChannel
    // //             var channelName = channel.name

    // //             const searchChannel = await youtube.search(yt, {
    // //                 type: "channel", // video | playlist | channel | all
    // //             });

    // //             let totalSubs = await searchChannel[0].subscriberCount

    // //             let subs = totalSubs.split(" ")[0]

    // //             var name = channelName.split(" ")[0]
    // //             channel.edit({ name: `${name} ${subs}` })
    // //                 .catch(console.error);
    // //         })
    // //     })
    // // }

    // // setInterval(subCounter, 1800000)
}