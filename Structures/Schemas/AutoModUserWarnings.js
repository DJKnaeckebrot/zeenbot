const { model, Schema } = require("mongoose")

module.exports = model("automoduserwarnings", new Schema({

    GuildID: { type: String, require: true },
    UserID: String,
    WarnIDs: Array

}))