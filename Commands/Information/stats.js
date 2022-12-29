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
            status = `\`🔴\` Disconnected`;
            break;
        case 1:
            status = `\`🟢\` Connected`;
            break;
        case 2:
            status = `\`🟡\` Connecting`;
            break;
        case 3:
            status = `\`🟣\` Disconnecting`;
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
            Green: "🟢",
            Yellow: "🟡",
            Red: "🔴",
        };

        const stats = new EmbedBuilder()
            .setColor("#1975D3")
            .setTitle("GENERAL INFO")
            .setDescription(
                [
                    `**🪧 Name :** ${client.user.username} | ${client.user}`,
                    `**🏷️ Tag :** ${client.user.tag}`,
                    `\**⚙️ Version :** ${pkg.version}`,
                    `**👑 Owner :** <insert name here>`,
                    `**🌐 Website :** <isert site here>`,
                    `**\`\`\`\nMore updates coming soon.(remove this if you want)\n\`\`\`**`,
                ].join("\n")
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 4096 }))
            .addFields(
                {
                    name: "BOT INFO",
                    value: [
                        `**❕ Status** :  [\`🟢\`] Online`,
                        `**🏓 Ping** : ${client.ws.ping}ms`,
                        `**⏱️ Uptime** :\n\`\`\`\n${days}Days, ${hours}Hours, ${minutes}Minutes, ${seconds}Seconds\n\`\`\``,
                    ].join("\n"),
                },
                {
                    name: "DataBase INFO",
                    value: [
                        `**🪧 Name :** MongoDB`,
                        `**❕ Status :** ${rState(connection.readyState)}`,
                    ].join("\n"),
                },
                {
                    name: "HOST & LIBRARY INFO",
                    value: [
                        `**🪧 Name :** None`,
                        `📚 **Library :** discord.js | V•${version}`,
                    ].join("\n"),
                },
            );

        interaction.reply({
            embeds: [stats],
        });
    },
};