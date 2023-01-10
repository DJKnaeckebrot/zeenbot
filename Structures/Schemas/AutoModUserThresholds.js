const { model, Schema } = require("mongoose")

module.exports = model("automoduserthresholds", new Schema({

    GuildID: { type: String, require: true },
    UserID: String,
    WordThreshold: { type: Number, default: 0 },
    LinkThreshold: { type: Number, default: 0 },
    CapsThreshold: { type: Number, default: 0 },
    MentionThreshold: { type: Number, default: 0 },
    InviteThreshold: { type: Number, default: 0 },

}))