const client = require("../../../Structures/index");
const { EmbedBuilder, Client, ActionRowBuilder } = require("discord.js");
const warnDB = require("../../../Structures/Schemas/Warnings");
const automodwarnsDB = require("../../../Structures/Schemas/AutoModWarnings");
const automouserwarnDB = require("../../../Structures/Schemas/AutoModUserWarnings");
const automouserthresholdDB = require("../../../Structures/Schemas/AutoModUserThresholds");
const { kicker } = require("../actions/Kick");
const { banner } = require("../actions/Ban");
const { muter } = require("../actions/timeout");
const { warner } = require("../actions/Warn");
const {warnUser} = require("../actions/warn");

async function processUserThreshold(client, user, guild, type, action) {

    console.log("Processing user threshold with following parameters: " + user + " | " + guild + " | " + type + " | " + action);

    switch (type) {
        case "words":
            switch (action) {
                case "Kick":
                    break;
                case "Ban":
                    console.log("Banning user for reaching word threshold");
                    break;
                case "Mute":
                    console.log("Muting user for reaching word threshold");
                    break;
                case "Warn":
                    console.log("Warning user for reaching word threshold");
                    await warnUser(client, user, guild, "Automod | Reached word threshold");
                    break;
                default:
                    break;
            }
    }


}

module.exports = { processUserThreshold };