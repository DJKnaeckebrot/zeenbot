const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const TicketSetup = require("../../Structures/Schemas/TicketSetup");
const ticketSchema = require("../../Structures/Schemas/Ticket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ManageChannels, SendMessages } = PermissionFlagsBits;

        if (!interaction.isButton()) return;

        if (!["reopen", "delete", "close", "lock", "unlock", "claim"].includes(customId)) return;

        const docs = await TicketSetup.findOne({ GuildID: guild.id });

        if (!docs) return;

        if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers))
            return interaction.reply({ content: "I don't have permissions for this.", ephemeral: true });

        const embed = new EmbedBuilder().setColor("Aqua");

        ticketSchema.findOne({ ChannelID: channel.id }, async (err, data) => {
            if (err) throw err;
            if (!data) return;

            const fetchedMember = await guild.members.cache.get(data.MembersID);

            const transcript = await createTranscript(channel, {
                limit: -1,
                returnBuffer: false,
                fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
            });

            const transcriptEmbed = new EmbedBuilder()
                .setTitle(`Transcript Type: ${data.Type}\nId: ${data.TicketID}`)
                .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            switch (customId) {
                case "reopen":
                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: false });
                    const reopenEmbed = new EmbedBuilder()
                        .setTitle("Ticket Reopened")
                        .setDescription(`Ticket has been reopened by ${member.user.tag}`)
                        .setColor("Green")
                        .setTimestamp();

                    await channel.permissionOverwrites.edit(member, { ViewChannel: true });

                    const reopenChannelName = channel.name.replace("closed-", "ticket-");

                    channel.setName(reopenChannelName);

                    await channel.send({ embeds: [reopenEmbed] });

                    await interaction.deferUpdate()

                    break;

                case "delete":
                    const deleteEmbed = new EmbedBuilder()
                        .setTitle("Ticket will be deleted")
                        .setDescription(`This ticket will be deleted in 10 seconds. \n Transscript has been saved to <#${docs.Transcripts}>`)
                        .setColor("Red")
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    channel.send({ embeds: [deleteEmbed] });

                    const res = await guild.channels.cache.get(docs.Transcripts).send({
                        embeds: [transcriptEmbed],
                    });

                    await interaction.deferUpdate()

                    setTimeout(function () {
                        member.send({ embeds: [transcriptEmbed.setDescription("Here is your transscript")], files: [transcript] })
                            .catch(() => channel.send('Couldn\'t send transcript to Direct Messages.'));
                        channel.delete();
                    }, 10000);
                    break;
                case "close":
                    if (data.closed == true)
                        return interaction.reply({ content: "Ticket is already getting deleted...", ephemeral: true });

                    const closeEmbed = new EmbedBuilder()
                        .setTitle("Ticket closed")

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });

                    const transcriptProcesss = new EmbedBuilder()
                        .setTitle('Ticket closed')
                        .setDescription(`Ticket was closed by ${interaction.user}.` )
                        .setColor("Red")
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    const button = new ActionRowBuilder().setComponents(
                        new ButtonBuilder().setCustomId('reopen').setLabel('Reopen').setStyle(ButtonStyle.Primary).setEmoji('🔓'),
                        new ButtonBuilder().setCustomId('delete').setLabel('Delete').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                    );

                    channel.send({ embeds: [transcriptProcesss], components: [button] });

                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { ViewChannel: false });
                    });

                    const closeChannelName = channel.name.replace("ticket-", "closed-");

                    await channel.setName(closeChannelName);

                    await interaction.deferUpdate()

                    break;

                case "lock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "You don't have permissions for that.", ephemeral: true });

                    if (data.Locked == true)
                        return interaction.reply({ content: "Ticket is already set to locked.", ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: true });
                    embed.setDescription("Ticket was locked succesfully 🔒");

                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: false });
                    });

                    return interaction.reply({ embeds: [embed] });

                case "unlock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "You don't have permissions for that.", ephemeral: true });

                    if (data.Locked == false)
                        return interaction.reply({ content: "Ticket is already set to unlocked.", ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
                    embed.setDescription("Ticket was unlocked succesfully 🔓");

                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: true });
                    });

                    return interaction.reply({ embeds: [embed] });

                case "claim":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "You don't have permissions for that.", ephemeral: true });

                    if (data.Claimed == true)
                        return interaction.reply({ content: `Ticket is already claimed by <@${data.ClaimedBy}>`, ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Claimed: true, ClaimedBy: member.id });

                    embed.setDescription(`Ticket was succesfully claimed by ${member}`);

                    interaction.reply({ embeds: [embed] });

                    break;

            }
        });
    }
}