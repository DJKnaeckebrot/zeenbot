// Deconstructing prefix from config file to use in help command

require("dotenv").config();
// eslint-disable-next-line no-undef
const prefix = process.env.PREFIX;

// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder, ChannelType } = require("discord.js");

/**
 * @type {import('../../typings').LegacyCommand}
 */
module.exports = {
    name: "help",
    description: "List all commands of bot or info about a specific command.",
    aliases: ["commands"],
    usage: "[command name]",
    cooldown: 5,

    execute(interaction, args) {
        const { commands } = interaction.client;

        // If there are no args, it means it needs whole help command.

        if (!args.length) {
            /**
             * @type {EmbedBuilder}
             * @description Help command embed object
             */

            let helpEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("List of all my commands")
                .setDescription(
                    "`" + commands.map((command) => command.name).join("`, `") + "`"
                )

                .addFields([
                    {
                        name: "Usage",
                        value: `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`,
                    },
                ]);

            // Attempts to send embed in DMs.
        }

        // If argument is provided, check if it's a command.

        /**
         * @type {String}
         * @description First argument in lower case
         */

        const name = args[0].toLowerCase();

        const command =
            commands.get(name) ||
            commands.find((c) => c.aliases && c.aliases.includes(name));

        // If it's an invalid command.

        if (!command) {
            return interaction.reply({ content: "That's not a valid command!" });
        }

        /**
         * @type {EmbedBuilder}
         * @description Embed of Help command for a specific command.
         */

        let commandEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Command Help");

        if (command.description)
            commandEmbed.setDescription(`${command.description}`);

        if (command.aliases)
            commandEmbed.addFields([
                {
                    name: "Aliases",
                    value: `\`${command.aliases.join(", ")}\``,
                    inline: true,
                },
                {
                    name: "Cooldown",
                    value: `${command.cooldown || 3} second(s)`,
                    inline: true,
                },
            ]);
        if (command.usage)
            commandEmbed.addFields([
                {
                    name: "Usage",
                    value: `\`${prefix}${command.name} ${command.usage}\``,
                    inline: true,
                },
            ]);

        // Finally send the embed.

        interaction.reply({ embeds: [commandEmbed] });
    },
};