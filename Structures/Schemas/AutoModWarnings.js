const { model, Schema } = require("mongoose")

module.exports = model("automodwarnings", new Schema({

    GuildID: { type: String, require: true },
    WordThreshold: { type: Number, default: 3 },
    LinkThreshold: { type: Number, default: 3 },
    CapsThreshold: { type: Number, default: 3 },
    MentionThreshold: { type: Number, default: 3 },
    InviteThreshold: { type: Number, default: 3 },
    WordAction: { type: String, default: "Warn" },
    LinkAction: { type: String, default: "Warn" },
    CapsAction: { type: String, default: "Warn" },
    MentionAction: { type: String, default: "Warn" },
    InviteAction: { type: String, default: "Warn" },
    DefaultMuteTime: { type: Number, default: 5 },
    DefaultMuteType: { type: String, default: "Minutes" },
    DefaultBanTime: { type: Number, default: 180 },
    DefaultBanType: { type: String, default: "Days" },


}))