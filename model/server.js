const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
    serverID: { type: String },
    disabledCommands: { type: Array, default: [] },
    prefix: {type: String, default: "="},
    errorMsgSystem: {type: String, default: "on"},
    mModeChannels: {type: Array, default: []},
    ytChannel: {type: String, default: ""},
    subCounterChannel: {type: String, default: ""}
})

module.exports = mongoose.model("Server", serverSchema)