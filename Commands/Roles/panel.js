const rrSchema = require("../../Structures/Schemas/ReactionRoles")
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "panel",
    description: "Create a reaction role panel",
    usage: "/panel",
    parameters: "none",
    category: "Roles",
    UserPerms: ["ManageRoles"],
    BotPerms: ["ManageRoles"],
    options: [],

    async execute(interaction) {
        const { options, guildId, guild, channel } = interaction;

        try {
            const data = await rrSchema.findOne({ GuildID: guildId });

            if (!data.roles.length > 0)
                return interaction.reply({ content: "This server does not have any data.", ephemeral: true });

            const panelEmbed = new EmbedBuilder()
                .setDescription("Please select a role below")
                .setColor("Aqua")

            const options = data.roles.map(x => {
                const role = guild.roles.cache.get(x.roleId);

                return {
                    label: role.name,
                    value: role.id,
                    description: x.roleDescription,
                    emoji: x.roleEmoji || undefined
                };
            });

            const menuComponents = [
                new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('reaction-roles')
                        .setMaxValues(options.length)
                        .addOptions(options),
                ),
            ];

            channel.send({ embeds: [panelEmbed], components: menuComponents });

            return interaction.reply({ content: "Succesfully sent your panel.", ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}