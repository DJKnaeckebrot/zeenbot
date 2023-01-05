const { model, Schema } = require("mongoose");

let ticketSetup = new Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Transcripts: String,
    Handlers: String,
    Everyone: String,
    Description: String,
    Buttons: [String],
    Response: { type: String, default: "Our team will contact you shortly. Please describe your issue." },
    PingStaff: { type: Boolean, default: true },
    TicketNumber: String
});

module.exports = model("TicketSetup", ticketSetup);