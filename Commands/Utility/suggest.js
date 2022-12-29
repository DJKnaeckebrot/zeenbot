const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, PermissionsFlagsBits, ButtonStyle, ActionRowBuilder } = require("discord.js")
const suggestionDB = require("../../Structures/Schemas/Suggestion");

module.exports = {
    name: "suggest",
    description: "Create a suggestion",
    category: "Utility",
    premium: true,
    options: [
        {
            name: "name",
            description: "Name your suggestion.",
            type: 3,
            required: true
        },
        {
            name: "description",
            description: "Describe your suggestion",
            type: 3,
            required: true
        }
    ],

    async execute(interaction) {
        const { options, guildId, member, user, guild, channel } = interaction;

        const type = options.getString("name")
        const description = options.getString("description")

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true}) })
            .addFields(
                { name: "Suggestion", value: description, inline: false },
                { name: "Type", value: type, inline: true },
                { name: "Status", value: "Pending", inline: true },
            )
            .setTimestamp()

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("suggest-approve").setLabel("✅ Approve").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("suggest-decline").setLabel("❌ Decline").setStyle(ButtonStyle.Danger),
        )

        try {
            const m = await channel.send({ embeds: [embed], components: [buttons], fetchReply: true });
            await channel.send({ content: "Use `/suggest` to create a suggestion" });
            await interaction.reply({ content: "Suggestion sent!", ephemeral: true });

            await suggestionDB.create({
                Guild: guildId, MessageID: m.id, Details: [
                    {
                        MemberID: member.id,
                        Type: type,
                        Description: description,
                    }
                ]
            });
        } catch (err) {
            console.log(err);
            await interaction.reply({ content: "Something went wrong!", ephemeral: true });
        }

    }
}
