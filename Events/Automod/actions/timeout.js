const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const featuresDB = require("../../../Structures/Schemas/Features");
const channelsDB = require("../../../Structures/Schemas/Channels");
const automodDB = require("../../../Structures/Schemas/Automod");
const automoduserwarnDB = require("../../../Structures/Schemas/AutoModUserWarnings");
const DB = require('../../../Structures/Schemas/Warnings')
const Reply = require("../../../Systems/Reply");
const automodeuserthreshold = require("../../../Structures/Schemas/AutoModUserThresholds");
const automodwarnsDB = require("../../../Structures/Schemas/AutoModWarnings");


async function muteUser(client, user, guild, reason) {

    let automod = await automodwarnsDB.findOne({ GuildID: guild.id });
    const LogChannel = await channelsDB.findOne({ GuildID: guild.id });

    const timeOutTime = automod.DefaultMuteTime

    const timeOutType = automod.DefaultMuteType

    // Timeoute user for the specified time
    const Member = guild.members.cache.get(user)

    let timeOut = null

    switch (timeOutType) {
        case "Minutes":
            timeOut = timeOutTime * 60000;
            break;
        case "Hours":
            timeOut = timeOutTime * 3600000;
            break;
        case "Days":
            timeOut = timeOutTime * 86400000;
            break;
        case "Weeks":
            timeOut = timeOutTime * 604800000;
            break;
        case "Months":
            timeOut = timeOutTime * 2629800000;
            break;
        case "Years":
            timeOut = timeOutTime * 31557600000;
            break;
        default:
            timeOut = timeOutTime * 60000;
            break;
    }


    Member.timeout(timeOut, reason)
        .catch(console.error);

    const automodLogChannel = LogChannel.AutomodLogChannel

    const embed = new EmbedBuilder()
        .setTitle(`⚠ | User Muted!`)
        .setColor(client.color)
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            { name: "Name:", value: `${client.user.tag}`, inline: true },
            { name: "Muted in:", value: `${guild.name}`, inline: true },
            { name: "Reason:", value: `${reason}`, inline: false },
        )
        .setFooter({ text: `ID: ${Member.id} | zeenbot`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()

    client.channels.cache.get(automodLogChannel).send({ embeds: [embed] })

    //console.log(`[AutoMod] Muted ${member.user.tag} for ${timeOutTime} ${timeOutType} for ${reason}`)
}

module.exports = { muteUser };