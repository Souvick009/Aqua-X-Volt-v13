const { readdirSync } = require("fs");

const ascii = require("ascii-table");
const { SlashCommandBuilder } = require('@discordjs/builders');

// Create a new Ascii table
let table = new ascii("Commands");
table.setHeading("Command", "Load status");
const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');

module.exports = (client) => {
    const commandss = []

    // Read every commands subfolder
    readdirSync("./commands/").forEach(dir => {
        // Filter so we only have .js command files
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));

        // Loop over the commands, and add all of them to a collection
        // If there's no name found, prevent it from returning an error,
        // By using a cross in the table we made.
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                commandss.push(pull)
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }
            // console.log(commandss)

            // If there's an aliases key, read the aliases.
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    })
    // console.log(commandss)
    const data = new SlashCommandBuilder()

    const rest = new REST({
        version: '9'
    }).setToken("NzIxNDYwODc3MDA1NDIyNjM0.XuU2zQ.aoHYWMfWsdOkkd4Epj0cKcaE4xw");

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands("721460877005422634"), {
                body: commandss
            },
            );
            // await rest.put(
            //     Routes.applicationCommands("626038642288099338"), {
            //         body: []
            //     },
            //     );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();


    console.log(table.toString());

}

/**
 * This is the basic command layout
 * module.exports = {
 *  name: "Command name",
 *  aliases: ["array", "of", "aliases"]
 *  category: "Category name",
 *  description: "Command description"
 *  usage: "[args input]",
 *  run: (client, message, args) => {
 *      The code in here to execute
 *  }
 * }
 */