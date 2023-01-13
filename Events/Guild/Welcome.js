const { Client, GuildMember, EmbedBuilder, AttachmentBuilder} = require("discord.js")
const DB = require("../../Structures/Schemas/Welcome")
const canvacord = require("canvacord")

module.exports = {
    name: "guildMemberAdd",

    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {

        const { user, guild } = member

        const Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

        const welcomeCard = new canvacord.Welcomer()
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
            .setMemberCount(guild.memberCount)
            .setGuildName(guild.name)
            .setAvatar(user.displayAvatarURL({ dynamic: false, format: "png" }))
            .setBackground("https://i.imgur.com/okIR1iY.png")

        const Card = await welcomeCard.build().catch(err => console.log(err))

        const attachment = new AttachmentBuilder(Card, { name: "welcome.png" })


        if (!Data) return

        const Message = `Hey ${user}, welcome to **${guild.name}**`

        let dmMsg

        let Msg = Data.Msg || " ";

        if (Data.DMMessage !== null) {

            var dmMessage = Data.DMMessage.content

            if (dmMessage.length !== 0) dmMsg = dmMessage
            else dmMsg = Message

        } else dmMsg = Message

        if (Data.Channel !== null) {

            const Channel = guild.channels.cache.get(Data.Channel)
            if (!Channel) return

            console.log(Data.Msg)

            const Embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .addFields(
                    { name: "Account Created", value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: "Member Count", value: `${guild.memberCount}`, inline: true },
                )
                .setDescription(Data.Msg)
                .setThumbnail(guild.iconURL())
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp()
                .setImage("attachment://welcome.png")

            Channel.send({ content: `${Message}`, embeds: [Embed], files: [attachment] })

        }

        if (Data.DM === true) {

            const Embed = Data.DMMessage.embed

            if (Data.Content === true && Data.Embed === true) {

                const Sent = await member.send({ content: `${dmMsg}` }).catch(err => {

                    if (err.code !== 50007) return console.log(err)

                })

                if (!Sent) return
                if (Embed) Sent.edit({ embeds: [Embed] })

            } else if (Data.Content === true && Data.Embed !== true) {

                const Sent = await member.send({ content: `${dmMsg}` }).catch(err => {

                    if (err.code !== 50007) return console.log(err)

                })

            } else if (Data.Content !== true && Data.Embed === true) {

                if (Embed) member.send({ embeds: [Embed] }).catch(err => {

                    if (err.code !== 50007) return console.log(err)

                })

            } else return

        }

    }
}