const Discord = require("discord.js");
const server = require("../../model/server.js")

module.exports = {
  name: "config",
  aliases: [],
  accessableby: "Manage Server",
  description: "This command is used to change configs for the bot in the server. Arguements available are [setPrefix], [emsg], [ed]",
  usage: "=config setprefix && \n =config errmsg on/off \n =config ed <command>",
  example: "=config setprefix &&, =config errmsg off , =config ed ban",
  category: "Utility",
  permission: ["MANAGE_GUILD"],
  botreq: "Embed Links",

  run: async (bot, message, args) => {
    const embed = new Discord.MessageEmbed()

    //permissions-



    //main code-
    server.findOne({
      serverID: message.guild.id,

    }, async (err, data) => {
      if (err) console.log(err);

      //if user wants to blacklist
      async function ed() {
        //code if user has provided command name
        if (args[1]) {

          let command = bot.commands.get(args[1])

          if (!command) command = bot.commands.get(bot.aliases.get(args[1]));
          if (!command) return message.channel.send(":x: Command not found!");


          if (data.disabledCommands.includes(command.name)) {
            let index = data.disabledCommands.indexOf(command.name)
            data.disabledCommands.splice(index, 1)
            message.channel.send("Command succesfully enabled")
          } else {
            data.disabledCommands.push(command.name);
            message.channel.send("Command succesfully disabled")
          }
          await data.save().catch(e => console.log(e));



          //code if user has not provided command name
        } else if (!args[1]) {


          if (data.disabledCommands.length === 0) {
            embed.setAuthor(`❌ NO DISABLED COMMANDS FOUND`)
            embed.setColor(0xFF0000)
            return message.channel.send({
              embeds: [embed]
            });

          } else {

            let disables = [];

            for (i = 0; i < data.disabledCommands.length; i++) {
              disables.push(`\`${i + 1}\` ** ${data.disabledCommands[i]}** `)
            }
            if (disables.length < 1) disables.push("None")

            embed.setAuthor(`Disabled Commands in ${message.guild.name}`, message.author.displayAvatarURL())
            embed.setColor(0x39dafa)
            embed.setDescription(`**Total Disabled Commands: ${data.disabledCommands.length}** \n -------------------------------------------- \n **Disabled Commands: ** \n ${disables.join("\n \n")}`)
            embed.setThumbnail(message.guild.iconURL())
            return message.channel.send({
              embeds: [embed]
            });

          }
        }
      }

      async function emsg() {
        if (args[1]) {
          //making sure its on/off only
          var onf = args[1].toLowerCase()
          if (!onf == "on" || !onf == "off") return message.channel.send("Please make sure that the you are providing ON/OFF as the second arguement. (Both captial and small work)")
          if (data.errorMsgSystem == onf) {
            message.channel.send(`Error message system is already turned ${onf}.`)
          } else {
            data.errorMsgSystem = onf
            message.channel.send("Error message system succesfully turned " + onf)
            await data.save().catch(e => console.log(e));

          }
        } else if (!args[1]) {
          message.channel.send("Error message system is turned " + data.errorMsgSystem)

        }
      }

      async function setPrefix() {
        if (args[1]) {
          data.prefix = args[1]
          await data.save().catch(e => console.log(e))
          message.channel.send("Succesfully changed prefix to: `" + args[1] + "`")
        } else {
          message.channel.send("Current prefix for the bot is: `" + data.prefix + "`")
        }
      }


      //which functino to run-
      if (!args[0]) return message.channel.send("Please re-send the command with the parameters - ed or emsg or setPrefix")
      if (args[0].toLowerCase() === "ed" || args[0].toLowerCase() === "command") {
        ed()
      } else if (args[0].toLowerCase() == "emsg" || args[0].toLowerCase() == "errmsg") {
        emsg()
      } else if (args[0].toLowerCase() == "setprefix" || args[0].toLowerCase() == "prefix") {
        setPrefix()
      }


    })
  }
}