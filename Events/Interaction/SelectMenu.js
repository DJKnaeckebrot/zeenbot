const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        const { customId, values, guild, member } = interaction; // you need to destructure values from interaction first to use it below

        if (interaction.isStringSelectMenu()) {
            if (customId == "reaction-roles'") return;
            console.log(`Got values for reaction roles: ${values}`);

            for (let i = 0; i < values.length; i++) {
                const roleId = values[i];

                const role = guild.roles.cache.get(roleId);
                const hasRole = member.roles.cache.has(roleId);

                switch (hasRole) {
                    case true:
                        member.roles.remove(roleId);
                        break;
                    case false:
                        member.roles.add(roleId);
                        break;
                }
            }

            interaction.reply({ content: "Roles updated.", ephemeral: true });
        } else {
            return;
        }
    },
};