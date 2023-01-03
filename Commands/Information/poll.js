const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, ApplicationCommandOptionType} = require("discord.js");


module.exports = {
    name: "poll",
    description: "Create a poll and send it to a certain channel",
    category: "Information",
    UserPerms: ["ManageGuild"],
    BotPerms: ["ManageGuild"],
    premium: false,
    options: [
        {
            name: "description",
            description: "Describe the poll.",
            type: 3,
            required: true
        },
        {
            name: "channel",
            description: "Where do you want to send the poll to?",
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel("channel");
        const description = options.getString("description");
        const user =  interaction.user;
        const icon = user.displayAvatarURL();
        const tag = user.tag;

        const embed = new EmbedBuilder()
            .setAuthor({ name: tag, iconURL: icon })
            .setColor("Blue")
            .setDescription(description)
            .setFooter({ text: `powered by zeenbot`, icon_url: "https://cdn.discordapp.com/attachments/1041329286969294858/1058348553392627723/z-white.png" })
            .setTimestamp();


        try {
            const m = await channel.send({ embeds: [embed] });
            await m.react("✅");
            await m.react("❌");
            await interaction.reply({ content: "Poll was succesfully sent to the channel.", ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}

