const Discord = require("discord.js");
const server = require("../../model/server")

module.exports = {
    name: "maintainance-mode",
    aliases: ["m-mode"],
    accessableby: "Manage Channels",
    description: "Enables or Disables the maintainance mode for the server",
    usage: "=m-mode on (For every channel) \n =m-mode on #channel (For every channel except #channel) \n =m-mode off (For every channel)",
    example: "=m-mode on, =m-mode on #chillzone, =m-mode off ",
    category: "Utility",
    permission: ["MANAGE_CHANNELS"],
    botreq: "Embed Links, Manage Channels",
    run: async (bot, message, args) => {

        if (!message.guild.me.permissions.has(["MANAGE_CHANNELS"])) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(0xFF0000)
            embed.setDescription("❌ Check My Permissions. [Missing Permissions:- MANAGE CHANNELS]")
            return message.channel.send({ embeds: [embed] });
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return message.channel.send("❌ I don't have Manage Channels permission in this channel!")

        // await message.delete();

        if (!args[0]) {
            return message.reply(`You have to mention that you want to on or off`)
        }


        if (args[0].toLowerCase() == "on") {

            //=m-mode on || =m-mode on #channel
            if (!args[1]) {
                var allChannels = message.guild.channels.cache.filter(c => c.permissionsFor(message.guild.roles.everyone).has("VIEW_CHANNEL") == true).map(e => e.id)
                //get list of channels that already has display channel perm off and store the list into an array named blocked
                //make an scheme named server in models folder, it should have a field serverID which will be string and a field temp data which will be a array
                //then use findone on the model here, if the no data is found for serverid then create data and add the channel ids in the temp array. If data is found do the same.
                server.findOne({
                    serverID: message.guild.id,
                }, async (err, data) => {
                    if (err) console.log(err);

                    if (data.mModeChannels.length > 0) {
                        return message.channel.send("Maintenance Mode is already ON for this server.")
                    } else {
                        // console.log(message.guild.channels.cache)
                        try {
                            let errors;
                            message.guild.channels.cache.filter(c => c.permissionsFor(message.guild.me).has(["MANAGE_CHANNELS", "MANAGE_PERMISSIONS"]) == true).forEach(async (channel, id) => {
                                try {
                                    await channel.permissionOverwrites.edit(message.channel.guild.me, {
                                        VIEW_CHANNEL: true
                                    })
                                } catch (error) {
                                    errors = true
                                    console.log(error)
                                    //break;
                                }
                                if (errors == true) {
                                    return message.channel.send({ content: `I don't have permission to edit any channels` })
                                }
                            })
                        } catch (error) {
                            return message.channel.send({ content: `I don't have permission to edit any channels` })
                        }

                        message.guild.channels.cache.filter(c => c.permissionsFor(message.guild.me).has(["MANAGE_CHANNELS", "MANAGE_PERMISSIONS"]) == true).forEach(async (channel, id) => {
                            await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                                VIEW_CHANNEL: false
                            }).catch(error => console.log(error))
                        });

                        data.mModeChannels = allChannels
                        await data.save().catch(e => console.log(e));
                        return message.reply(`Maintainance-mode is now on for this server. All channels are now private,you should make a channel public for members!`)
                    }

                })
            } else {
                //Maintainance - Mode #channel se us channel ko chorke baaaki sab channel lock ho jayenge
                var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                if (!channel) return message.reply(`${args[1]} channel doesn't exist on this server`)
                var allChannels = message.guild.channels.cache.filter(c => c.permissionsFor(message.guild.roles.everyone).has("VIEW_CHANNEL")).map(e => e.id)

                //get list of channels that already has display channel perm off and store the list into an array named blocked
                //make an scheme named server in models folder, it should have a field serverID which will be string and a field temp data which will be a array
                //then use findon on the model here, if the no data is found for serverid then create data and add the channel ids in the temp array. If data is found do the same.
                server.findOne({
                    serverID: message.guild.id,
                }, async (err, data) => {
                    if (err) console.log(err);
                    if (data.mModeChannels.length > 0) {
                        return message.channel.send("Maintenance Mode is already ON for this server.")
                    } else {
                        data.mModeChannels = allChannels
                        await data.save().catch(e => console.log(e));

                        try {
                            message.guild.channels.cache.filter(c => c.permissionsFor(message.guild.me).has(["MANAGE_CHANNELS", "MANAGE_PERMISSIONS"]) == true && c.name !== channel.name).forEach(async (channel, id) => {
                                try {
                                    await channel.permissionOverwrites.edit(message.channel.guild.me, {
                                        VIEW_CHANNEL: true
                                    })
                                } catch (error) {
                                    console.log(error)
                                    //break;
                                }
                            });
                        } catch (error) {
                            return message.channel.send({ content: `I don't have permission to edit any channels` })
                        }

                        message.guild.channels.cache.filter(c => c.permissionsFor(message.guild.me).has(["MANAGE_CHANNELS", "MANAGE_PERMISSIONS"]) == true && c.name !== channel.name).forEach(async (channel, id) => {
                            try {
                                await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                                    VIEW_CHANNEL: false
                                })
                            } catch (error) {
                                console.log(error)
                                //break;
                            }
                        });
                        // message.guild.channels.cache.filter(a => a.name !== channel.name).forEach(async (channel, id) => {
                        //     await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                        //         VIEW_CHANNEL: false
                        //     })
                        // });

                        return message.reply(`Maintainance-mode is now on in this server. Unlocked Channel - <#${channel.id}>`)

                    }

                })
            }
        } else if (args[0].toLowerCase() == "off") {

            var channels = []
            var shouldOff = []
            //get the tempdata and store it in a variable called data
            server.findOne({
                serverID: message.guild.id,
            }, async (err, data) => {
                if (err) console.log(err);
                if (!data.mModeChannels.length) {
                    // shouldOff = message.guild.channels
                    return message.reply(`Maintainance Mode is already off in this server!`)
                }
                // if (data.mModeChannels.length < 1) {
                //     return message.channel.send("Maintenance Mode is already off for this server.")
                // } else {
                channels = data.mModeChannels
                channels.forEach(async (id) => {
                    shouldOff.push(message.guild.channels.cache.get(id))
                })
                try {
                    shouldOff.filter(c => c.permissionsFor(message.guild.me).has(["MANAGE_CHANNELS", "MANAGE_PERMISSIONS"]) == true).forEach(async (channel, id) => {
                        try {
                            await channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                                VIEW_CHANNEL: null
                            })
                        } catch (error) {
                            console.log(error)
                            //break;
                        }

                        try {
                            await channel.permissionOverwrites.delete(message.guild.me)
                        } catch (error) {
                            console.log(error)
                            //break;
                        }

                    });
                } catch (error) {
                    return message.channel.send({ content: `I don't have permission to edit any channels, Give me Administrator permission and try again` })
                }
                data.mModeChannels = []
                await data.save().catch(e => console.log(e));
                return message.reply(`Maintainance-mode is now off for this server`)

                //in the data array add -allChannels.filter(a => a.name !== channel.name)
                //for this use data.push(allChannels.filter(a => a.name !== channel.name))

                //m-mode of


                // }
            })
        }

        // console.log(should)
        // if (should == false) return

    }
}