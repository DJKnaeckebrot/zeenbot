const {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    EmbedBuilder,
    version,
} = require("discord.js");const EditReply = require("../../Systems/EditReply")
const { connection } = require("mongoose");
const moment = require("moment");
const pkg = require(`${process.cwd()}/package.json`);
require("../../Events/Client/Ready.js");

function rState(val) {
    var status = " ";
    switch (val) {
        case 0:
            status = `\`:red_circle:\` Disconnected`;
            break;
        case 1:
            status = `\`:green_circle:\` Connected`;
            break;
        case 2:
            status = `\`:yellow_circle:\` Connecting`;
            break;
        case 3:
            status = `\`:purple_circle:\` Disconnecting`;
            break;
    }
    return status;
}


module.exports = {
    name: "stats",
    description: "Displays the Bot Status",
    category: "Information",

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async  execute(interaction, client) {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        let webLatency = new Date() - interaction.createdAt;
        let apiLatency = client.ws.ping;

        let emLatency = {
            Green: ":green_circle:",
            Yellow: ":yellow_circle:",
            Red: ":red_circle:",
        };

        const stats = new EmbedBuilder()
            .setColor("#1975D3")
            .setTitle("GENERAL INFO")
            .setDescription(
                [
                    `:wave: ** Name :** ${client.user.username} | ${client.user}`,
                    `:placard: ** Tag :** ${client.user.tag}`,
                    `:baby: ** Version :** ${pkg.version}`,
                    `:crown: ** Owner :** DJKnaeckebrot#0001`,
                    `:globe_with_meridians: ** Website :** https://zeenbot.de`,
                ].join("\n")
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 4096 }))
            .addFields(
                {
                    name: "BOT INFO",
                    value: [
                        `:grey_exclamation: ** Status** :  :green_circle: Online`,
                        `:ping_pong: ** Ping** : ${client.ws.ping}ms`,
                        `:alarm_clock: ** Uptime** :\n\`\`\`\n${days}Days, ${hours}Hours, ${minutes}Minutes, ${seconds}Seconds\n\`\`\``,
                    ].join("\n"),
                },
                {
                    name: "DataBase INFO",
                    value: [
                        `:placard: ** Name :** MongoDB`,
                        `:grey_exclamation: ** Status :** ${rState(connection.readyState)}`,
                    ].join("\n"),
                },
                {
                    name: "HOST & LIBRARY INFO",
                    value: [
                        `:placard: ** Name :** None`,
                        `:books: **Library :** discord.js | V ${version}`,
                    ].join("\n"),
                },
            );

        interaction.reply({
            embeds: [stats],
        });
    },
};