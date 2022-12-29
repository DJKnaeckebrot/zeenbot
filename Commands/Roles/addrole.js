const rrSchema = require("../../Structures/Schemas/ReactionRoles")
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrole")
        .setDescription("Add custom reaction role")
        .setDefaultMemberPermissions(PermissionFlagsBits.MANAGE_ROLES)
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("Role to be assigned")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Description for the role")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("emoji")
                .setDescription("Emoji for the role")
                .setRequired(false)
        ),
    async execute(interaction) {
        const { options, guildId, member } = interaction;

        const role = options.getRole("role")
        const description = options.getString("description")
        const emoji = options.getString("emoji")

        try {

            if (role.position >= member.roles.highest.position)
                return interaction.reply({ content: "I dont have permissions to do that.", ephemeral: true});

            const data = await rrSchema.findOne({ Guild: guildId});

            const newRole = {
                roleId: role.id,
                roleDescription: description || "No description",
                roleEmoji: emoji || "",
            }

            if (data) {
                let roleData = data.roles.find((x) => x.roleId === role.id);

                if (roleData) {

                }
            }

        } catch (err) {
            console.log(err);
        }

    }
}