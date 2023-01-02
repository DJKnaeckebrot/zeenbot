const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, ApplicationCommandNumericOptionMinMaxValueMixin,
    ApplicationCommandOptionType
} = require("discord.js");
const Reply = require("../../Systems/Reply");
const EditReply = require("../../Systems/EditReply");


module.exports = {
    name: "voice",
    description: "Control your own channel",
    category: "Community",
    premium: true,
    options: [
        {
            name: "invite",
            description: "Invite a friend to your channel.",
            type: 1,
            options: [
                {
                    name: "member",
                    description: "Select the member",
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: "disallow",
            description: "Remove someone's access to the channel.",
            type: 1,
            options: [
                {
                    name: "member",
                    description: "Select the member",
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: "name",
            description: "Change the name of your channel.",
            type: 1,
            options: [
                {
                    name: "text",
                    description: "Provide the name.",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "public",
            description: "Make your channel public to everyone",
            type: 1,
            options: [
                {
                    name: "turn",
                    description: "Turn on or off.",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "🟢 On",
                            value: "on"
                        },
                        {
                            name: "🔴 Off",
                            value: "off"
                        },
                    ]
                }
            ]
        }
    ],

    /**
     *
     * @param {CommandInteraction} interaction
     */

    async execute(interaction, client) {
        const { options, member, guild }  = interaction;

        const subCommand = options.getSubcommand();
        const voiceChannel = member.voice.channel;
        const Embed = new EmbedBuilder().setColor("#36393F");
        const ownedChannel = client.voiceGenerator.get(member.id);

        if(!voiceChannel)
            return interaction.reply({ embeds: [Embed.setDescription("You're not in a voice channel.").setColor("Aqua")]});

        if(!ownedChannel || voiceChannel.id !== ownedChannel)
            return interaction.reply({ embeds: [Embed.setDescription("You do not own this, or any channel.").setColor("Red")]});

        switch(subCommand) {
            case "name": {
                const newName = options.getString("text");
                if(newName.length > 22 || newName.length < 1)
                    return Reply(interaction, "🚫", `Name cannot exceed the 22 character limit`, true);

                voiceChannel.edit({ name: newName });
                Reply(interaction, "✅", `Channel name has been set to ${newName}`, true);
            }
                break;
            case "invite": {
                const targetMember = options.getUser("member");
                voiceChannel.permissionOverwrites.edit(targetMember, {Connect: true});

                await targetMember.send({ embeds: [Embed.setDescription(`${member} has invited you to <#${voiceChannel.id}>`)]});
                Reply(interaction, "✅", `${targetMember} has been invited`, true);
            }
                break;
            case "disallow": {
                const targetMember = options.getUser("member");
                voiceChannel.permissionOverwrites.edit(targetMember, {Connect: false});

                if(targetMember.voice.channel && targetMember.voice.channel.id == voiceChannel.id) targetMember.voice.setChannel(null);
                Reply(interaction, "✅", `${targetMember} has been removed from this channel.`, true);
            }
                break;
            case "public": {
                await interaction.deferReply({ ephemeral: true });
                try{
                    const turnChoice = options.getString("turn");
                    if(turnChoice == 'on'){
                        voiceChannel.permissionOverwrites.edit(guild.id, {Connect: true, ViewChannel: true}).catch(e => console.log(e));
                        await EditReply(interaction, "✅", `The channel is now public`, true);
                    } else{
                        voiceChannel.permissionOverwrites.edit(guild.id, {Connect: false, ViewChannel: false}).catch(e => console.log(e));
                        await EditReply(interaction, "✅", `The channel is now closed`, true);
                    }
                } catch(error){console.log(error)}

            }
                break;
        }
    }
}