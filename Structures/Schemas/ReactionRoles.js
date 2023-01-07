const { model, Schema } = require("mongoose")

module.exports = model("reactionroles", new Schema({

    GuildID: String,
    roles: Array

}))