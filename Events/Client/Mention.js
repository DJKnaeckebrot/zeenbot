const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {

        const { author, guild, content } = message
        const { user } = client

        if (!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return
        if (!content.includes(user.id)) return

        return message.reply({

            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setDescription(`Hey, you called me? I'm zeenbot! Nice to meet you. Type \`/\` & click on my logo to see all my commands!\n\n*This message will be deleted in \`30 seconds\`!*`)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: "Introduction to zeenbot" })
                    .setTimestamp()
            ],

            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.com/api/oauth2/authorize?client_id=1047099666182967317&permissions=8&scope=bot%20applications.commands")
                        .setLabel("Invite Me"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://zeenbot.de")
                        .setLabel("Dashboard"),

                )
            ]

        }).then(msg => {

            setTimeout(() => {

                msg.delete().catch(err => {

                    if (err.code !== 10008) return console.log(err)

                })

            }, ms("30s"))

        })

    }
}