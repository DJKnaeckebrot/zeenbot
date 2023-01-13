const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const featuresDB = require("../../../Structures/Schemas/Features");
const channelsDB = require("../../../Structures/Schemas/Channels");
const automodDB = require("../../../Structures/Schemas/Automod");
const automoduserwarnDB = require("../../../Structures/Schemas/AutoModUserWarnings");
const DB = require('../../../Structures/Schemas/Warnings')
const Reply = require("../../../Systems/Reply");
const automodeuserthreshold = require("../../../Structures/Schemas/AutoModUserThresholds");


    async function warnUser(client, user, guild, warnReason) {
        const member = user
        const reason = warnReason || "no reason provided"

        const Member = guild.members.cache.get(member)

        const LogChannel = await channelsDB.findOne({ GuildID: guild.id });

        const autpmodLogChannel = LogChannel.AutomodLogChannel

        let Data = new DB({

            UserID: member,
            GuildID: guild.id,
            Moderator: "AutoMod",
            Reason: reason,
            Timestamp: Date.now()

        })

        let data = new automoduserwarnDB({
            GuildID: guild.id,
            UserID: user,
        });

        await Data.save()
        Data.populate();

        await data.save();

        Member.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`⚠ | You have been Warned!`)
                    .setColor(client.color)
                    .setThumbnail(client.user.displayAvatarURL())
                    .addFields(
                        { name: "Name:", value: `${client.user.tag}`, inline: true },
                        { name: "Warned in:", value: `${guild.name}`, inline: true },
                        { name: "Reason:", value: `${reason}`, inline: false },
                    )
                    .setFooter({ text: `ID: ${data._id} | zeenbot`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
            ]
        }).catch((err) => {

            if (err.code !== 50007) return console.log(err)

        })

        const embed = new EmbedBuilder()
            .setTitle(`⚠ | User Warned`)
            .setColor(client.color)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: "Name:", value: `${client.user.tag}`, inline: true },
                { name: "Warned in:", value: `${guild.name}`, inline: true },
                { name: "Reason:", value: `${reason}`, inline: false },
            )
            .setFooter({ text: `ID: ${data._id} | zeenbot`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()

        client.channels.cache.get(autpmodLogChannel).send({ embeds: [embed] })

        let userThreshold = await automodeuserthreshold.findOne({ GuildID: guild.id, UserID: user });

        userThreshold.WordThreshold = 0;
        await userThreshold.save();
    }

module.exports = { warnUser }