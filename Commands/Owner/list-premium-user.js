const User = require("../../Structures/Schemas/Premium");
const moment = require("moment");
const { Collection, MessageEmbed, EmbedBuilder} = require("discord.js");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "list-premium-user",
    description: "Lists all premium users",
    category: "Owner",
    options: [],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(interaction, client, args) {

        if (interaction.user.id !== "424868316398747648") return EditReply(interaction, "❌", `This command is classified!`)

        let data = client.userSettings
            .filter((data) => data.isPremium === true)
            .map((data, index) => {
                return ` <@${data.Id}> Expire At :- \`${moment(
                    data.premium.expiresAt
                ).format("dddd, MMMM Do YYYY")}\` Plan :- \`${data.premium.plan}\` `;
            });

        interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(
                    data.join("\n") || "No Premium User Found"
                ),
            ],
        });
    }
}