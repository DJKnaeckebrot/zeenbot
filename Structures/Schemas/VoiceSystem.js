const { model, Schema } = require('mongoose')

module.exports = model("VoiceSystem", new Schema({
    GuildID: String,
    MaxSize: { type: Number, default: 3 },
    DefaultName: { type: String, default: "🗣 │ {user}" },

}))