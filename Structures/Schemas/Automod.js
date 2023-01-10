const { model, Schema } = require("mongoose")

module.exports = model("automod", new Schema({

    GuildID: { type: String, require: true },
    IgnoredChannels: Array,
    IgnoredRoles: Array,
    IgnoreAdmins: { type: Boolean, default: true },
    FilteredWords: Object,
    FilteredLinks: Object,
    FilterCaps: { type: Boolean, default: false },

}))