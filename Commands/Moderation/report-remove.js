const { Client, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
    ApplicationCommandOptionType
} = require("discord.js")
const DB = require("../../Structures/Schemas/ReportsDB")//fix the paths accordingly
const ChannelDB = require("../../Structures/Schemas/ReportChannel")//fix the paths accordingly

module.exports = {
    name: "report-remove",
    description: "Remove a report from a user for your guild",
    usage: "/report-remove :user",
    parameter: "user",
    UserPerms: ["ManageGuild"],
    category: "Moderation",
    options: [
        {
            name: "user",
            description: "Select the user",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        const { options, guild, channel } = interaction

            const User = options.getUser("user")

            const Embed = new EmbedBuilder()
                .setColor(client.color)

            if (!User) return interaction.reply({
                embeds: [Embed
                    .setDescription("**Please select a user**")
                    .setColor("DarkRed")
                ], ephemeral: true
            })

            let Data = await DB.findOne({ Guild: guild.id, User: User.id }).catch(err => { })

            if (!Data) return interaction.reply({
                embeds: [Embed
                    .setDescription("**This user has no reports**")
                    .setColor("DarkRed")
                ], ephemeral: true
            })

            const ChannelData = await ChannelDB.findOne({ Guild: guild.id }).catch(err => { })

            if (!ChannelData) return interaction.reply({
                embeds: [Embed
                    .setDescription("**Please setup the report channel**")
                    .setColor("DarkRed")
                ], ephemeral: true
            })

            const ReportChannel = guild.channels.cache.get(ChannelData.Channel)

            await DB.deleteOne({ Guild: guild.id, User: User.id }).catch(err => { })

        /////Modal Part
        const modal = new ModalBuilder()
            .setCustomId("removeReportUser")
            .setTitle("Remove User Report")

        const reasonInput = new TextInputBuilder()
            .setCustomId("report_remove_reason")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Enter the reason for removing the report of this user")
            .setMaxLength(1000)
            .setRequired(true)

        const Row = new ActionRowBuilder().addComponents(reasonInput)
        modal.addComponents(Row)
        /////Modal Part ended

        await interaction.showModal(modal)
        const modalSubmitInteraction = interaction.awaitModalSubmit({ time: 1000 * 60 * 2 }).catch(async err => {
            if (err.code == "InteractionCollectorError") return
        })

        var reason = (await modalSubmitInteraction).fields.getTextInputValue("report_remove_reason")
        if (!reason) return

            ; (await modalSubmitInteraction).reply({
            embeds: [Embed.setDescription(`Removed Report from  ${User}!`)], ephemeral: true
        })

        const Channel = await ChannelDB.findOne({ Guild: guild.id})
        if (!Channel) return

        const logChannel = guild.channels.cache.get(Channel.Channel)
        if (!logChannel) return

        logChannel.send({
            embeds: [new EmbedBuilder()
                .setTitle(`❗ | User Report Removed!`)
                .setColor(client.color)
                .addFields(
                    { name: "Report Removed by: ", value: `${interaction.user}`, inline: true },
                    { name: "Reason", value: `${reason}`, inline: false },
                )
                .setDescription(`Report for ${User} has been removed by ${interaction.user}`)
                .setThumbnail(User.displayAvatarURL())
                .setFooter({ text: `ID: ${User.id}` })
                .setTimestamp()
            ]
        })
    }
}