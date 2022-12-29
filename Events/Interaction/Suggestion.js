const { PermissionFlagsBits, EmbedBuilder, IntegrationApplication } = require("discord.js");
const suggestionDB = require("../../Structures/Schemas/Suggestion");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const {member, guildId, customId, message} = interaction;

        if (!interaction.isButton()) return;

        if (customId === "suggest-approve" || customId === "suggest-decline") {
            if (!member.permissions.has(PermissionFlagsBits.Administrator))
                return interaction.reply({
                content: "You don't have permission to use this button!",
                ephemeral: true
            });

            suggestionDB.findOne({Guild: guildId, MessageID: message.id}, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({
                        content: "This suggestion doesn't exist in the database!",
                        ephemeral: true
                    });

                const embed = message.embeds[0];

                if (!embed)
                    return interaction.reply({
                        content: "This suggestion doesn't exist in the database!",
                        ephemeral: true
                    });

                switch (customId) {
                    case "suggest-approve":
                        embed.data.fields[2] = {name: "Status", value: "Approved", inline: true};
                        const approvedEmbed = new EmbedBuilder.from(embed).setColor("Green");

                        message.edit({embeds: [approvedEmbed]});
                        interaction.reply({content: "Suggestion approved!", ephemeral: true});
                        break;

                    case "suggest-decline":
                        embed.data.fields[2] = {name: "Status", value: "Declined", inline: true};
                        const declinedEmbed = new EmbedBuilder.from(embed).setColor("Red");

                        message.edit({embeds: [declinedEmbed]});
                        interaction.reply({content: "Suggestion declined!", ephemeral: true});
                        break;
                }
            });
        }
    }
}