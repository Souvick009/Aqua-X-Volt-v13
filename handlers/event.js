const fs = require("fs")
const Server = require("../model/server.js")
const serverUser = require("../model/serverUser.js")
const { Client } = require("youtubei");
const youtube = new Client();

module.exports = (bot, Discord) => {
    const load_dir = (dir) => {
        const event_files = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith("js"))
        for (const file of event_files) {
            const event = require(`../events/${dir}/${file}`)
            const event_name = file.split(".")[0]
            bot.on(event_name, event.bind(null, bot, Discord, Server, serverUser, youtube))
        }
    }

    ['bot', 'guild'].forEach(e => load_dir(e))
}