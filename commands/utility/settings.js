const Discord = require("discord.js");
const server = require("../../model/server.js")
const send = require("../../utils/sendMessage.js")
const Utils = require("utils-discord");

module.exports = {
  name: "settings",
  aliases: ["config"],
  accessableby: "Manage Server",
  description: "This command is used to change configs for the bot in the server.",
  usage: "=settings setprefix && \n =settings errmsg on/off \n =settings ed <command>",
  example: "=settings setprefix &&, =settings errmsg off , =settings ed ban",
  category: "Utility",
  permission: ["MANAGE_GUILD"],
  botreq: "Embed Links",
  options: [{
    name: "type",
    description: "The setting you want to change",
    required: false,
    type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
    req: "string",
    choices: [
      {
        name: "enable/disable",
        value: "ed"
      },
      {
        name: "setPrefix",
        value: "prefix"
      },
      {
        name: "errormsg",
        value: "errmsg"
      },
    ]

  }, {
    name: "input",
    description: "Enter the input for the setting you want to change",
    required: false,
    type: 3, //https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
    req: "string"
  }],

  run: async (bot, message, args, options, author) => {
    const embed = new Discord.MessageEmbed()

    //permissions-

    var type = options[0]
    let input = options[1]

    //main code-
    server.findOne({
      serverID: message.guild.id,

    }, async (err, data) => {
      if (err) console.log(err);

      //if user wants to blacklist
      async function ed() {
        //code if user has provided command name
        if (input) {

          let command = bot.commands.get(input)

          if (!command) command = bot.commands.get(bot.aliases.get(input));
          if (!command) return send(message, { content: ":x: Command not found!" }, true);


          if (data.disabledCommands.includes(command.name)) {
            let index = data.disabledCommands.indexOf(command.name)
            data.disabledCommands.splice(index, 1)
            send(message, { content: "Command succesfully enabled" }, true)
          } else {
            if (command.name == "settings") {
              return send(message, { content: "The `Settings` command can't be disable." }, true)
            }
            data.disabledCommands.push(command.name);
            send(message, { content: "Command succesfully disabled" }, true)
          }
          await data.save().catch(e => console.log(e));

          //code if user has not provided command name
        } else if (!input) {

          if (data.disabledCommands.length === 0) {
            embed.setAuthor({ name: `❌ NO DISABLED COMMANDS FOUND`, })
            embed.setColor(0xFF0000)
            return send(message, {
              embeds: [embed]
            }, true);

          } else {

            let disables = [];

            for (i = 0; i < data.disabledCommands.length; i++) {
              disables.push(`\`${i + 1}\` ** ${data.disabledCommands[i]}** `)
            }
            if (disables.length < 1) disables.push("None")
            var toSend = [];

            disables.forEach((disabled, i) => {
              toSend.push(`${disabled} \n`)
            })
            // embed.setDescription(disables.join("\n \n"))


            toSend.unshift(`**Total Disabled Commands: ${data.disabledCommands.length}** \n -------------------------------------------- \n **Disabled Commands: **`)

            let options2 = {
              author: `Disabled Commands in ${message.guild.name}`,
              color: "0x39dafa",
              args: args[0],
              buttons: true,
              thumbnail: message.guild.iconURL(),
              perpage: 11,
              authorImage: author.displayAvatarURL()
            }
            Utils.createEmbedPages(bot, message, toSend, options2)
            return

            // return send(message, {
            //   embeds: [embed]
            // }, true);

          }
        }
      }

      async function emsg() {
        if (input) {
          //making sure its on/off only
          var onf = input.toLowerCase()
          if (!onf == "on" || !onf == "off") return message.channel.send("Please make sure that the you are providing ON/OFF as the second arguement. (Both captial and small work)")
          if (data.errorMsgSystem == onf) {
            send(message, { content: `Error message system is already turned ${onf}.` }, true)
          } else {
            data.errorMsgSystem = onf
            send(message, { content: "Error message system succesfully turned " + onf }, true)
            await data.save().catch(e => console.log(e));

          }
        } else if (!input) {
          send(message, { content: "Error message system is turned " + data.errorMsgSystem }, true)

        }
      }

      async function setPrefix() {
        if (input) {
          data.prefix = input
          await data.save().catch(e => console.log(e))
          send(message, { content: "Succesfully changed prefix to: `" + input + "`" }, false)
        } else {
          send(message, { content: "Current prefix for the bot is: `" + data.prefix + "`" }, false)
        }
      }


      //which functino to run-
      // if (!type) return send(message, { content: "Please re-send the command with the parameters - ed or emsg or setPrefix" }, true)
      if (!type) {
        const embed = new Discord.MessageEmbed()
        embed.setAuthor({ name: `${message.guild.name}'s Settings`, iconURL: message.guild.iconURL() })
        embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
        embed.addField("ErrorMessage System", `\`\`\`${data.errorMsgSystem}\`\`\``)
        embed.addField("Prefix", `\`\`\`${data.prefix}\`\`\``)
        embed.addField("Total Commands Disabled", `\`\`\`${data.disabledCommands.length}\`\`\``)
        embed.addField("Disabled Commands", `\`\`\`${data.disabledCommands}\`\`\``)
        embed.setColor("#1d47c4")
        embed.setTimestamp()
        embed.setFooter({ text: author.tag, iconURL: author.displayAvatarURL() })
        return send(message, { embeds: [embed] }, false)
      }

      if (type.toLowerCase() === "ed" || type.toLowerCase() === "command") {
        ed()
      } else if (type.toLowerCase() == "emsg" || type.toLowerCase() == "errmsg") {
        emsg()
      } else if (type.toLowerCase() == "setprefix" || type.toLowerCase() == "prefix") {
        setPrefix()
      } else {
        return send(message, { content: "Please re-send the command with the parameters - ed or emsg or setPrefix" }, true)
      }
    })
  }
}