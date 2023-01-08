const { model, Schema } = require("mongoose")

module.exports = model("levelupchannel", new Schema({

    Guild: String,
    Channel: String,


}))