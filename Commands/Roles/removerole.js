const rrSchema = require("../../Structures/Schemas/ReactionRoles")
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "removerole",
    description: "Remove custom reaction role",
    usage: "/removerole :role\"ROLE\"",
    parameters: "role",
    category: "Roles",
    UserPerms: ["ManageRoles"],
    BotPerms: ["ManageRoles"],
    options: [
        {
            name: "role",
            description: "Select a role from the discord server to remove from the reaction role.",
            type: 8,
            required: true,
        }
    ],

    async execute(interaction) {
        const { options, guildId, member } = interaction;

        const role = options.getRole("role");

        try {

            const data = await rrSchema.findOne({ GuildID: guildId });

            if (!data)
                return interaction.reply({ content: "This server does not have any data.", ephemeral: true });

            const roles = data.roles;
            const findRole = roles.find((r) => r.roleId === role.id);

            if (!findRole)
                return interaction.reply({ content: "This role does not exist.", ephemeral: true });

            const filteredRoles = roles.filter((r) => r.roleId !== role.id);
            data.roles = filteredRoles;

            await data.save();

            return interaction.reply({ content: `Removed role **${role.name}**` });

        } catch (err) {
            console.log(err);
        }
    }
}