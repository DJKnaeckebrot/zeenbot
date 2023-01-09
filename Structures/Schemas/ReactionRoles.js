const { model, Schema } = require("mongoose")

module.exports = model("reactionroles", new Schema({

    GuildID: String,
    roles: Array,
    Status: { type: Boolean, default: false },
    ChannelID: String,
    MessageID: String,
    Text: { type: String, default: "Please select a role below" },

}))