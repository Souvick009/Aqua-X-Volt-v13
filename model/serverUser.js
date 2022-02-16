const mongoose = require("mongoose");

const serverUserSchema = new mongoose.Schema({
    serverID: { type: String },
    userID: { type: String },
    warns: {type: Array, default: []},
    mutes: {type: Array, default: []},
    muteStatus: {type: String, default: ""}
})

module.exports = mongoose.model("ServerUser", serverUserSchema)