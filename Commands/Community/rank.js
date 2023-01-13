const { Client, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } = require("discord.js")
const Reply = require("../../Systems/Reply")
const levelDB = require("../../Structures/Schemas/Level")
const Canvacord = require("canvacord")
const { profileImage } = require("discord-arts");

module.exports = {
    name: "rank",
    description: "Displays rank card",
    category: "Community",
    options: [
        {
            name: "user",
            description: "Select a user",
            required: false,
            type: 6
        }
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { options, user, guild } = interaction

        await interaction.deferReply("Loading...")

        const Member = options.getMember("user") || user
        const member = guild.members.cache.get(Member.id)

        const Data = await levelDB.findOne({ Guild: guild.id, User: member.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `${member} has not gained any XP!`)

        const Required = Data.Level * Data.Level * 100 + 100
        const background = Data.BackgroundImage || "https://cdn.discordapp.com/attachments/881202202001569812/881202222201733130/unknown.png"

        const buffer = await profileImage(member.id, {
            borderColor: ['#000000', '#ffffff'],
            presenceStatus: member.presence?.status ?? 'invisible',
            badgesFrame: true,
            usernameColor: '#09ede6',
            customBackground: background,
            squareAvatar: true,
            rankData: {
                currentXp: Data.XP,
                requiredXp: Required,
                level: Data.Level,
                barColor: "#09ede6",
            }
        })
        const Img = new AttachmentBuilder(buffer, { name: 'rank.png' })

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`${member.user.username}'s Rank Card`)
            .setFooter({ text: `${member.user.tag}'s Rank` })
            .setImage("attachment://rank.png")
            .setTimestamp();

        interaction.followUp({ embeds: [Embed], files: [Img] })

    }
}