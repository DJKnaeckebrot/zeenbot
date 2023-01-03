const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType, ApplicationCommandOptionType } = require("discord.js");
const TicketSetup = require("../../Structures/Schemas/TicketSetup"); // since it's multi-guilded we won't be using the config anymore

module.exports = {
    name: "ticketsetup",
    description: "(Premium) Create a ticket message.",
    category: "Tickets",
    premium: true,
    UserPerms: ["ManageChannels"],
    BotPerms: ["ManageChannels"],
    options: [
        {
            name: "channel",
            description: "Select the channel where the tickets should be created.",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "category",
            description: "Select the parent of where the tickets should be created.",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "transcripts",
            description: "Select the channel where the transcripts should be sent.",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "handlers",
            description: "Select the ticket handlers role.",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "everyone",
            description: "Tag the everyone role.",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "description",
            description: "Set the description for the ticket embed.",
            type: 3,
            required: true
        },
        {
            name: "firstbutton",
            description: "Format: (Name of button, Emoji)",
            type: 3,
            required: true
        },
        {
            name: "secondbutton",
            description: "Format: (Name of button, Emoji)",
            type: 3,
            required: false
        },
        {
            name: "thirdbutton",
            description: "Format: (Name of button, Emoji)",
            type: 3,
            required: false
        },
        {
            name: "fourthbutton",
            description: "Format: (Name of button, Emoji)",
            type: 3,
            required: false
        }
    ],

    async execute(interaction) {
        const { guild, options } = interaction;

        try {
            const channel = options.getChannel("channel");
            const category = options.getChannel("category");
            const transcripts = options.getChannel("transcripts");

            const handlers = options.getRole("handlers");
            const everyone = options.getRole("everyone");

            const description = options.getString("description");
            const firstbutton = options.getString("firstbutton").split(",");
            const secondbutton = options.getString("secondbutton").split(",");
            const thirdbutton = options.getString("thirdbutton").split(",");
            const fourthbutton = options.getString("fourthbutton").split(",");

            const emoji1 = firstbutton[1];
            const emoji2 = secondbutton[1];
            const emoji3 = thirdbutton[1];
            const emoji4 = fourthbutton[1];

            await TicketSetup.findOneAndUpdate(
                { GuildID: guild.id },
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlers.id,
                    Everyone: everyone.id,
                    Description: description,
                    Buttons: [firstbutton[0], secondbutton[0], thirdbutton[0], fourthbutton[0]]
                },
                {
                    new: true,
                    upsert: true,
                }
            );

            const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId(firstbutton[0]).setLabel(firstbutton[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
                new ButtonBuilder().setCustomId(secondbutton[0]).setLabel(secondbutton[0]).setStyle(ButtonStyle.Secondary).setEmoji(emoji2),
                new ButtonBuilder().setCustomId(thirdbutton[0]).setLabel(thirdbutton[0]).setStyle(ButtonStyle.Primary).setEmoji(emoji3),
                new ButtonBuilder().setCustomId(fourthbutton[0]).setLabel(fourthbutton[0]).setStyle(ButtonStyle.Success).setEmoji(emoji4),
            );

            const embed = new EmbedBuilder()
                .setDescription(description)

            await guild.channels.cache.get(channel.id).send({
                embeds: ([embed]),
                components: [
                    button
                ]
            });

            interaction.reply({ content: "Ticket message has been sent.", ephemeral: true });
        } catch (err) {
            console.log(err);
            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Something went wrong...");

            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}