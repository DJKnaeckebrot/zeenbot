const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const channels = require("../../Structures/Schemas/Channels");
const SuggestDB = require("../../Structures/Schemas/SuggestDB");
const featuresDB = require("../../Structures/Schemas/Features");

module.exports = {
  name: "suggest",
  description: "Create a suggestion",
  category: "Utility",
  options: [
    {
      name: "type",
      description: "Whats the type of your suggestion.",
      type: 3,
      required: true,
      choices: [
        {
            name: "Command",
            type: 3,
            value: "command",
        },
        {
            name: "Event",
            type: 3,
            value: "event",
        },
        {
            name: "System",
            type: 3,
            value: "system",
        },
        {
            name: "Other",
            type: 3,
            value: "other",
        }
      ]
    },
    {
      name: "description",
      description: "Describe your suggestion.",
      type: 3,
      required: true
    }
  ],

  async execute(interaction, client) {
    const { options, guildId, member, user, guild } = interaction;

    const data = await channels.findOne({ GuildID: guildId }).catch(err => { })
    const feature = await featuresDB.findOne({ GuildID: guildId }).catch(err => { })

    if (!feature.Suggestions) return interaction.reply({ content: "Suggestions are not yet set up for this server!", ephemeral: true })

    if (!data) return interaction.reply({ content: "This server doesn't have a suggestion channel setup.", ephemeral: true })

    const type = options.getString("type");
    const description = options.getString("description");

    const channel = guild.channels.cache.get(data.Suggestions); // only non-multi-guilded part

    const embed = new EmbedBuilder()
        .setColor("Orange")
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: "Suggestion:", value: description, inline: false },
            { name: "Type:", value: type, inline: true },
            { name: "Status:", value: "Pending", inline: true },
        )
        .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("suggest-accept").setLabel("Accept").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("suggest-decline").setLabel("Decline").setStyle(ButtonStyle.Danger), // you can use this format, but I will change it to this:
    );

    try {
      const m = await channel.send({ embeds: [embed], components: [buttons], fetchReply: true });
      await channel.send({ content: "Use `/suggest` in the bot-commands channel to submit your suggestion. " });
      await interaction.reply({ content: "Suggestion was succesfully sent to the channel.", ephemeral: true });

      await SuggestDB.create({
        GuildID: guildId, MessageID: m.id, Details: [
          {
            MemberID: member.id,
            Type: type,
            Suggestion: description
          }
        ]
      });
    } catch (err) {
      console.log(err);
    }
  },
};
