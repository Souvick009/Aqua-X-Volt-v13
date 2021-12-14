const mongoose = require("mongoose");

const warningsSchema = new mongoose.Schema({
    serverID: { type: String },
    userID: { type: String },
    administrator: { type: Array, default: [] },
    reason: { type: Array, default: [] },
    id:  { type: Array, default: [] },
    date:  { type: Array, default: [] }
})

module.exports = mongoose.model("Warnings", warningsSchema)