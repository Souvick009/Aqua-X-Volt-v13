const Discord = require('discord.js');
const Intents = Discord.Intents
const { readdirSync } = require("fs");

const ascii = require("ascii-table");

// Create a new Ascii table
let table = new ascii("Commands");
table.setHeading("Command", "Load status");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const bot = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
})
const fs = require('fs');
const mongoose = require("mongoose");
const dbUrl = "dburl"
const token = "token";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = fs.readdirSync("./commands/");
["command", "event"].forEach(handler => {
  require(`./handlers/${handler}`)(bot, Discord);
});

bot.login(token)