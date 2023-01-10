const { model, Schema } = require("mongoose")

module.exports = model("warnings", new Schema({

    UserID: String,
    GuildID: String,
    Moderator: String,
    Reason: String,
    Timestamp: String

}))