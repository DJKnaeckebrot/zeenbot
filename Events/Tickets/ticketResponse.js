const { ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const TicketSetup = require("../../Structures/Schemas/TicketSetup");
const ticketSchema = require("../../Structures/Schemas/Ticket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } = PermissionFlagsBits;

        // const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return;

        const data = await TicketSetup.findOne({ GuildID: guild.id });

        if (!data)
            return;

        let buttons = [];

        if (data.Button1) buttons.push(data.Button1)
        if (data.Button2) buttons.push(data.Button2)
        if (data.Button3) buttons.push(data.Button3)
        if (data.Button4) buttons.push(data.Button4)

        if (!buttons.includes(customId)) return;

        if (!guild.members.me.permissions.has(ManageChannels))
            interaction.reply({ content: "I don't have permissions for this.", ephemeral: true });


        try {
            const lastTicket = await TicketSetup.findOne({ GuildID: guild.id });
            const lastTicketID = lastTicket.TicketNumber
            let ticketId = 1;
            let newTicketId = 1;

            if (!lastTicketID) {
                lastTicket.TicketNumber = ticketId;
                await lastTicket.save();
                ticketId = zeroPad(ticketId, 5);
            } else {
                newTicketId = lastTicketID + 1;
                lastTicket.TicketNumber = newTicketId;
                await lastTicket.save();
                ticketId = zeroPad(newTicketId, 5);
            }

            let ticketName = "ticket"

            if (!data.TicketName) {
                ticketName = data.TicketName
            } else {
                if (data.TicketName === "{member.user.id}") {
                    ticketName = member.user.tag
                }
            }

            await guild.channels.create({
                name: `${ticketName}-${ticketId}`,
                type: ChannelType.GuildText,
                parent: data.Category,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MembersID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                    Claimed: false,
                });

                const responseText = data.Response || "Our team will contact you shortly. Please describe your issue.";

                const replacedResponse = responseText.replace(/{member.user.tag}/g, member.user.tag)

                const embed = new EmbedBuilder()
                    .setTitle(`${guild.name} - ${member.user.tag}'s Ticket`)
                    .setDescription(replacedResponse)
                    .setFooter({ text: `${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('Close ticket').setStyle(ButtonStyle.Primary).setEmoji('❌'),
                    new ButtonBuilder().setCustomId('lock').setLabel('Lock the ticket').setStyle(ButtonStyle.Secondary).setEmoji('🔐'),
                    new ButtonBuilder().setCustomId('unlock').setLabel('Unlock the ticket').setStyle(ButtonStyle.Success).setEmoji('🔓'),
                    new ButtonBuilder().setCustomId('claim').setLabel('Claim').setStyle(ButtonStyle.Secondary).setEmoji('🛄')
                );

                if (data.PingStaff) { channel.send("<@&" + data.Handlers + ">") }

                channel.send({
                    embeds: ([embed]),
                    components: [
                        button
                    ]
                });

                interaction.reply({ content: `Succesfully created ticket. ${channel}`, ephemeral: true });
            });
        } catch (err) {
            return console.log(err);
        }
    }
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}