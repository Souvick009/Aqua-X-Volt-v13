module.exports = async (bot, Discord, Server, serverUser, youtube, interaction) => {
    var args = []
    if (!interaction.isCommand()) return;
    if (!interaction.guild.available) return
    const command = bot.commands.get(interaction.commandName)
    if (!command) return;
    Server.findOne({
        serverID: interaction.guildId,
    }, async (err, data) => {
        if (err) console.log(err)
        if (!data) {
            data = new Server({
                serverID: interaction.guildId,
            })
            await data.save().catch(e => console.log(e));
        }

        if (data.disabledCommands.includes(command.name)) {
            const disabledEmbed = new Discord.MessageEmbed()
            disabledEmbed.setDescription(`This Command is disabled in this server`)
            disabledEmbed.setColor(0xFF0000)
            return interaction.reply({
                embeds: [disabledEmbed],
                ephemeral: true
            })
        }

        if (!interaction.guild.me.permissions.has(["SEND_MESSAGES"])) return

        if (!interaction.channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES")) return

        if (!interaction.guild.me.permissions.has(["EMBED_LINKS"])) return interaction.reply("❌ I don't have Embed Links permission!")

        if (!interaction.channel.permissionsFor(interaction.guild.me).has("EMBED_LINKS")) return interaction.reply("❌ I don't have Embed Links permission in this channel!")

        cmdRun = async (cmd) => {
            var options = []
            interaction.options._hoistedOptions.forEach(option => {

                options.push(option.value)
            });
            try {
                await cmd.run(bot, interaction, args, options, interaction.user)
            } catch (e) {
                console.log(e)
            }
        }
        var perms = command.permission;
        if (!perms) {
            // console.log("nahi hain perms")
            return cmdRun(command)
        }


        var no_perms = []
        for (const perm of perms) {
            if (!interaction.member.permissions.has([perm])) {
                no_perms.push(perm)
                if (no_perms == "MODERATE_MEMBERS") {
                    no_perms = "Timeout Members"
                }
                if (no_perms.length !== 0) {
                    const embed = new Discord.MessageEmbed()
                    embed.setColor(0xFF0000)
                    embed.setDescription(`❌ You do not have permissions to the command. Please contact a staff member.[Missing Permsissions:- ${no_perms}]`)
                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }
            }
        }
        return cmdRun(command)
    })
}