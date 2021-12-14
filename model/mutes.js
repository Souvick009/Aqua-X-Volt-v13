const mongoose = require("mongoose");

const mutesSchema = new mongoose.Schema({
    serverID: { type: String },
    userID: { type: String },
    administrator: { type: Array, default: [] },
    type: {type: Array, default: []},
    reason: { type: Array, default: [] },
    date:  { type: Array, default: [] },
    duration:  { type: Array, default: [] }
})

module.exports = mongoose.model("Mutes", mutesSchema)