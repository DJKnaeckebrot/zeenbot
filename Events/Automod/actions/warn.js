const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const featuresDB = require("../../../Structures/Schemas/Features");
const channelsDB = require("../../../Structures/Schemas/Channels");
const automodDB = require("../../../Structures/Schemas/Automod");
const automoduserwarnDB = require("../../../Structures/Schemas/AutoModUserWarnings");
const DB = require('../../../Structures/Schemas/Warnings')
const Reply = require("../../../Systems/Reply");


    async function warnUser(client, user, guild, warnReason) {
        const member = user
        const reason = warnReason || "no reason provided"

        const Member = guild.members.cache.get(member)

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

        let userWarns = await DB.find({ UserID: user.id, GuildID: guild.id });

        userWarns.forEach(warn => {
            data.WarnIDs.push(warn._id);
        });

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


    }

module.exports = { warnUser }