const { model, Schema } = require("mongoose")

module.exports = model("features", new Schema({

    GuildID: String,
    Suggestions: { type: Boolean, default: true },

}))