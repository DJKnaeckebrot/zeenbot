const { Client, VoiceState, ChannelType, client, EmbedBuilder} = require("discord.js");
const DB = require("../../Structures/Schemas/VoiceSystem");
const featuresDB = require("../../Structures/Schemas/Features");
const channelsDB = require("../../Structures/Schemas/Channels");

module.exports = {
    name: "voiceStateUpdate",
    rest: false,
    once: false,
    /**
     * @param {Client} client
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    async execute(oldState, newState, client) {
        const { member, guild } = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        const channels = await channelsDB.findOne({ GuildID: guild.id });
        const features = await featuresDB.findOne({ GuildID: guild.id });
        const voiceHubs = await DB.findOne({ GuildID: guild.id });

        if (!channels) return;

        const voiceHub = channels.VoiceHubs;

        const year = new Date().getFullYear();

        if (features.VoiceHubs === false) {
            if (oldChannel !== newChannel && newChannel && voiceHub.includes(newChannel.id)) {
                member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("WOW an easter egg!")
                            .setDescription("Looks like you found a feature that is not enabled on this server. If you want to enable this feature, please contact the server owner.")
                            .setColor(client.color)
                            .setTimestamp()
                            .setFooter({
                                text: `©️ ${year} | zeenbot`, iconURL: client.user.avatarURL()
                            })
                    ]
                })
            }
        }

        const joinToCreate = DB.findOne({ GuildID: guild.id }, async (err, data) => {
            if(!data) return;

            if (features.VoiceHubs === false) return;

            let channelNameDesign = voiceHubs.DefaultName || `🗣 │ ${member.user.tag}`;
            let channelName = channelNameDesign.replace(/{user}/g, member.user.tag);


            if(oldChannel !== newChannel && newChannel && voiceHub.includes(newChannel.id)) {
                const voiceChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: newChannel.parent,
                    permissionOverwrites: [
                        { id: member.user.id, allow: ["Connect"]},
                        { id: guild.id, allow: ["Connect"]}
                    ]
                })

                client.voiceGenerator.set(member.id, voiceChannel.id);
                const userLimit = DB.findOne({ GuildID: guild.id }, async (err, Data) => {
                    await voiceChannel.setUserLimit(Data.MaxSize);
                    const voiceEmbed = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle("How to use the voice channels and its commands")
                        .setFooter({ text: `${member.user.tag}'s voice channel`, iconURL: member.user.displayAvatarURL() })
                        .setTimestamp()
                        .addFields(
                            { name: "Invite a person into a channel", value: "Use the /voice invite :person command to invite a person into your channel"},
                            { name: "Disallow a person from a channel", value: "Use the /voice disallow :person command to disallow a person from your channel"},
                            { name: "Change the size of the channel", value: "Use the /voice size :number command to change the size of your channel"},
                            { name: "Make the channel public", value: "Use the /voice public :turn command to make your channel public"},
                        )

                    voiceChannel.send({ embeds: [voiceEmbed] });
                })

                await newChannel.permissionOverwrites.edit(member, {Connect: false});

                setTimeout(() => newChannel.permissionOverwrites.delete(member), 30*1000);

                return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
            }

            const ownedChannel = client.voiceGenerator.get(member.id);

            if(ownedChannel && oldChannel.id == ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
                client.voiceGenerator.set(member.id, null);
                oldChannel.delete().catch(() => {});
            }
        });
    }
};