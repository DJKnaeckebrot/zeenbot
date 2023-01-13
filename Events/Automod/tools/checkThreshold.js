const client = require("../../../Structures/index");
const { EmbedBuilder, Client, ActionRowBuilder } = require("discord.js");
const { processUserThreshold } = require("./processThreshold");
const warnDB = require("../../../Structures/Schemas/Warnings");
const automodwarnsDB = require("../../../Structures/Schemas/AutoModWarnings");
const automoduserwarnDB = require("../../../Structures/Schemas/AutoModUserWarnings");
const automoduserthresholdDB = require("../../../Structures/Schemas/AutoModUserThresholds");

async function checkUserThresholds(client, user, guild, type) {
    let automodwarns = await automodwarnsDB.findOne({ GuildID: guild.id });

    let userThreshold = await automoduserthresholdDB.findOne({ GuildID: guild.id, UserID: user});

    console.log("Current user threshold: " + userThreshold);

    console.log("User : " + user);

    if (!userThreshold) {
        userThreshold = new automoduserthresholdDB({
            GuildID: guild.id,
            UserID: user,
            WordThreshold: 0,
            MentionThreshold: 0,
            InviteThreshold: 0,
            CapsThreshold: 0,
            SpamThreshold: 0
        })
        await userThreshold.save();
    }

    userThreshold = await automoduserthresholdDB.findOne({ GuildID: guild.id, UserID: user});
    const userWarns = await automoduserwarnDB.find({ GuildID: guild.id, UserID: user});

    console.log("User warns lenght : " + Object.keys(userWarns).length);

    switch (type) {
        case "words":
            if (!userThreshold.WordThreshold) {
                console.log("No user threshold found, creating one now");
                userThreshold.WordThreshold = 1;

                await userThreshold.save();
            } else {
                if (userThreshold.WordThreshold >= automodwarns.WordThreshold - 1) {
                    console.log("User threshold reached, processing now");
                    if (Object.keys(userWarns).length >= automodwarns.WarnThreshold - 1) {
                        console.log("User has 2 or more warns, processing threshold now");
                        await processUserThreshold(client, user, guild, type, automodwarns.WarnAction);
                        return
                    }
                    await processUserThreshold(client, user, guild, type, automodwarns.WordAction);
                    userThreshold.WordThreshold++;
                    await userThreshold.save();
                } else {
                    console.log("User threshold not reached, incrementing by 1");
                    userThreshold.WordThreshold++;
                    await userThreshold.save();
                }
            }
            break;
        case "mentions":
            console.log("Mentions Threshold Reached");
            break
        case "invites":
            console.log("Invites Threshold Reached");
            break;
        case "caps":
            console.log("Caps Threshold Reached");
            break;
        case "spam":
            console.log("Spam Threshold Reached");
            break;
        default:
            console.log("No Threshold Reached");
            break;
    }

    return userThreshold;
}

module.exports = { checkUserThresholds }
