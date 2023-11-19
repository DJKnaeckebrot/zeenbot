const { Client, GuildMember, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "guildMemberAdd",

    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     */
    async execute(member, client) {

        const { guild, user } = member

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.MemberJoin === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: "Logged by zeenbot" })
            .setTimestamp()


        return Channel.send({
            embeds: [
                Embed
                    .setTitle(`Member Joined`)
                    .setColor('#02ff02')
                    .addFields({
                        name: "⏲️ Account created:",
                        value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
                    })
                    .setDescription(`<@${user.id}> joined the server. \n ${guild.memberCount}th to join`)
                    .setFooter({ text: `${user.id}` })
                    .setTimestamp()
            ]
        })



    }
}

/**
 * @param {Array} arr1 - First Array
 * @param {Array} arr2 - Second Array
 */
function Unique(arr1, arr2) {

    let unique1 = arr1.filter(o => arr2.indexOf(o) === -1)
    let unique2 = arr2.filter(o => arr1.indexOf(o) === -1)

    const unique = unique1.concat(unique2)

    return unique

}