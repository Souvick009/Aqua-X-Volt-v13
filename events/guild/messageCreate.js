module.exports = (bot, Discord, Server, serverUser, youtube, message) => {
    // if (message.author.id === "721460877005422634") return;
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.guild) return;
    if (!message.guild.available) return
    var prefix;
    Server.findOne({
        serverID: message.guild.id,
    }, async (err, data) => {
        if (err) console.log(err)
        if (!data) {
            data = new Server({
                serverID: message.guild.id
            })
            await data.save().catch(e => console.log(e));
        }
        // console.log(data)
        prefix = data.prefix

        //added condition that if message starts with bot ping
        if (message.content.startsWith(prefix) || message.content.startsWith("<@!721460877005422634>")) {
            //declaring args variable
            var args;
            //added this condition to customize arg according to prefix
            if (message.content.startsWith("<@!721460877005422634>")) {  //remember to replace this id with your bot's id
                //22letters will be removed from arg if message starts with bot ping
                args = message.content.slice(22).trim().split(/ +/g);
            } else {
                //length of prefix will be removed from arg if message doesnt starts with bot ping
                args = message.content.slice(prefix.length).trim().split(/ +/g);
            }

            if (args[0] == "servers") {
                if (message.author.id === "530054630131105794" || message.author.id === "603508758626435072") {
                    message.reply(`Currently on ${bot.guilds.cache.size} Servers`)
                }
            }

            //rest is the same code
            const cmd = args.shift().toLowerCase();
            if (cmd.length === 0) return;
            // Get the command
            let command = bot.commands.get(cmd);
            // If none is found, try to find it by alias
            if (!command) command = bot.commands.get(bot.aliases.get(cmd));


            if (!command) return
            // console.log(data.commands.includes(command.name))
            if (data.disabledCommands.includes(command.name)) return
            //if (talkedRecently.has(message.author.id)) {
            //    message.reply("You are on a cooldown of 5 Seconds.");
            //} else {
            if (!message.guild.me.permissions.has(["SEND_MESSAGES"])) return

            if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return

            if (!message.guild.me.permissions.has(["EMBED_LINKS"])) return message.channel.send("❌ I don't have Embed Links permission!")

            if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send("❌ I don't have Embed Links permission in this channel!")

            var perms = command.permission;
            if (!perms) {
                // console.log("nahi hain perms")
                return command.run(bot, message, args)
            }


            var no_perms = []
            for (const perm of perms) {
                if (data.errorMsgSystem == "on") {
                    if (!message.member.permissions.has([perm])) {
                        no_perms.push(perm)
                        if (no_perms.length !== 0) {
                            const embed = new Discord.MessageEmbed()
                            embed.setColor(0xFF0000)
                            embed.setDescription(`❌ You do not have permissions to the command. Please contact a staff member.[Missing Permsissions:- ${no_perms}]`)
                            return message.channel.send({
                                embeds: [embed]
                            })
                        }
                    }

                }

                if (data.errorMsgSystem == "off") {
                    if (!message.member.permissions.has([perm])) {
                        return
                    }
                }
            }
            command.run(bot, message, args);
        }
    })
}