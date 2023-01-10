const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const featuresDB = require("../../Structures/Schemas/Features");
const channelsDB = require("../../Structures/Schemas/Channels");
const automodDB = require("../../Structures/Schemas/Automod");

module.exports = {
    name: "messageCreate",

    /**
     * @param {Client} client
     */
    async execute(msg, client) {
        if (!msg.guild) return;
        if (msg.author?.bot) return;

        const guild = msg.guild;
        const channel = msg.channel;

        let channels = await channelsDB.findOne({ GuildID: guild.id });
        let features = await featuresDB.findOne({ GuildID: guild.id });
        let automods = await automodDB.findOne({ GuildID: guild.id });

        if (features.AutoMod === false) return;

        // Check if mesasge is in ignored channel
        const ignoredChannels = automods.IgnoredChannels;

        if (ignoredChannels.includes(channel.id)) {
            return
        }

        // Check if message is send from ignored role
        const ignoredRoles = automods.IgnoredRoles;

        if (ignoredRoles.some(role => msg.member.roles.cache.has(role))) {
            return
        }

        // Check if logging channel is set
        let logging = false;
        let loggingChannel = null;
        if (channels.AutoModLogging !== null) {
            loggingChannel = guild.channels.cache.get(channels.AutoModLogging);
            logging = true;
        } else {
            logging = false;
        }

        if (!automods) return;

        if (features.AutoMod === true) {
            // Check if bot has permissions
            if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

            // Check if ignored admins is enabled
            if (automods.IgnoreAdmins === true) {
                if (msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
            }


            // Set up link filters
            const filteredLinks = automods.FilteredLinks;
            const filteredWords = automods.FilteredWords;


            // Check if message contains filtered links
            const url =
                /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

            if (url.test(msg)) {
                console.log("Link detected");
                let unallowedLink = null
                if (filteredLinks.some(link => msg.content.includes(link))) {
                    // Output link
                    unallowedLink = msg.content.match(url)[0];
                    console.log("Unallowed link: " + unallowedLink);
                    const e = new EmbedBuilder()
                        .setDescription(`🗑 In *${guild.name}* links from ${unallowedLink} are not allowed!`)
                        .setColor(client.color);

                    msg.delete();

                    msg.channel
                        .send({ embeds: [e], content: `${msg.author}` })
                        .then((mg) => setTimeout(mg.delete.bind(mg), 5000));

                    if (logging === true) {
                        const embed = new EmbedBuilder()
                            .setTitle("Automod triggered")
                            .setDescription(`**Message sent by ${msg.author} in ${channel} was deleted**`)
                            .addFields(
                                { name: "**Message:**", value: msg.content },
                                { name: "**Reason:**", value: `**Filtered link** : ${unallowedLink}` }
                            )
                            .setColor(client.color)
                            .setFooter({ text: `User ID: ${msg.author.id} | automod by zeenbot`, iconURL: msg.author.avatarURL() })
                            .setTimestamp();

                        loggingChannel.send({ embeds: [embed] });
                    }

                    return;
                }
            }

            // Check if message contains filtered words
            if (filteredWords.some(word => msg.content.includes(word))) {
                // Output word
                const unallowedWord = msg.content.match(filteredWords);
                const e = new EmbedBuilder()
                    .setTitle("Automod triggered")
                    .setDescription(`🗑 In *${guild.name}* the word **${unallowedWord}** is not allowed!`)

                if (logging === true) {
                    const embed = new EmbedBuilder()
                        .setTitle("Automod triggered")
                        .setDescription(`**Message sent by ${msg.author} in ${channel} was deleted**`)
                        .addFields(
                            { name: "**Message:**", value: msg.content },
                            { name: "**Reason:**", value: `**Filtered word** : ${unallowedWord}` }
                        )
                        .setColor(client.color)
                        .setFooter({ text: `User ID: ${msg.author.id} | automod by zeenbot`, iconURL: msg.author.avatarURL() })
                        .setTimestamp();

                    loggingChannel.send({ embeds: [embed] });
                }


                msg.delete();

                msg.channel
                    .send({ embeds: [e], content: `${msg.author}` })
                    .then((mg) => setTimeout(mg.delete.bind(mg), 10000));

                return;
            }

        } return
    },
};