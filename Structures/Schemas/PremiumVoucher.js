const { model, Schema } = require("mongoose")

module.exports = model("premium-codes", new Schema({

    code: { type: String, default: null },
    expiresAt: { type: Number, default: null },
    plan: { type: String, default: null },

}))