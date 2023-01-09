const { model, Schema } = require("mongoose")

module.exports = model("verification", new Schema({

    GuildID: String,
    Role: String,
    Channel: String,
    MessageID: String,
    TimeOut: { type: String, default : "30000" },
    Message: { type: String, default: "Please verify yourself by clicking the button below" }

}))