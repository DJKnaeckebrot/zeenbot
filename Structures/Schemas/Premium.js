const { model, Schema } = require("mongoose")

module.exports = model("user", new Schema({

    Id: { type: String, default: null, unique: true },
    isPremium: { type: Boolean, default: false },
    premium : {
        redeemedBy: { type: Array, default: null },
        redeemedAt: { type: Number, default: null },
        expiresAt: { type: Number, default: null },
        plan: { type: String, default: null },
    },

}))