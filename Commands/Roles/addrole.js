const rrSchema = require("../../Structures/Schemas/ReactionRoles")
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "addrole",
    description: "Add custom reaction role",
    usage: "/addrole :role\"ROLE\" :message\"MESSAGE\" :emoji\"EMOJI\"",
    parameters: "role, description, emoji",
    category: "Roles",
    UserPerms: ["ManageRoles"],
    BotPerms: ["ManageRoles"],
    options: [
        {
            name: "role",
            description: "Select a role from the discord server to add to the reaction role.",
            type: 8,
            required: true,
        },
        {
            name: "description",
            description: "Enter a description for the reaction role.",
            type: 3,
            required: false,
        },
        {
            name: "emoji",
            description: "Select an emoji to add to the reaction role.",
            type: 3,
            required: false,
        }
    ],

    async execute(interaction) {
        const { options, guildId, member } = interaction;

        const role = options.getRole("role");
        const description = options.getString("description");
        const emoji = options.getString("emoji");

        try {

            if (role.position >= member.roles.highest.position)
                return interaction.reply({ content: "I don't have permissions for that.", ephemeral: true });

            const data = await rrSchema.findOne({ GuildID: guildId });

            const newRole = {
                roleId: role.id,
                roleDescription: description || "No description.",
                roleEmoji: emoji || "",
            }

            if (data) {
                let roleData = data.roles.find((x) => x.roleId === role.id);

                if (roleData) {
                    roleData = newRoleData;
                } else {
                    data.roles = [...data.roles, newRole]
                }

                await data.save();
            } else {
                await rrSchema.create({
                    GuildID: guildId,
                    roles: newRole,
                });
            }

            return interaction.reply({ content: `Created new role **${role.name}**` });

        } catch (err) {
            console.log(err);
        }

    }
}