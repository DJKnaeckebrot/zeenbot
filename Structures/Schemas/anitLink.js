const { model, Schema } = require("mongoose");

module.exports = model(
    "Antilink",
    new Schema({
        GuildID: { type: String, require: true },
        ignoredChannels: Array
    })
);