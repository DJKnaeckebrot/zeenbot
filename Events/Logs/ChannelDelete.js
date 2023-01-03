const { Client, GuildChannel, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")
const GeneralLogsDB = require("../../Structures/Schemas/LogsChannel")

module.exports = {
    name: "channelDelete",

    /**
     * @param {GuildChannel} channel
     * @param {Client} client
     */
    async execute(channel, client) {

        const { guild, name } = channel

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const dbData = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.ChannelStatus === false) return
        if (!data) return

        const logsChannel = data.Channel
        const category = channel.parent
        const ignoredCategory = dbData.IgnoreChannels

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        if (ignoredCategory.includes(category.id)) {
            return
        }

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`${process.env.Settings} | Channel Deleted`)
                    .setDescription(`A channel has been deleted named: **${name}**`)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by zeenbot" })
                    .setTimestamp()
            ]
        })

    }
}