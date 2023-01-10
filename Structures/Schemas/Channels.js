const { model, Schema } = require("mongoose")

module.exports = model("channels", new Schema({

    GuildID: String,
    Suggestions: String,
    AutoModLogging: String,
    VoiceHubs: Array,

}))