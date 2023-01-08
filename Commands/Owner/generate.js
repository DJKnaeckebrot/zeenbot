const { Client, ChatInputCommandInteraction } = require("discord.js");
const moment = require("moment");
const voucher_codes = require("voucher-code-generator");
const schema = require("../../Structures/Schemas/PremiumVoucher");
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "generate",
    description: "Generates a voucher code",
    category: "Owner",
    options : [
        {
            name: "plan",
            description: "Select a plan",
            type: 3,
            required: true,
            choices: [
                {
                    name: "daily",
                    value: "daily"
                },
                {
                    name: "weekly",
                    value: "weekly"
                },
                {
                    name: "monthly",
                    value: "monthly"
                },
                {
                    name: "yearly",
                    value: "yearly"
                }
            ]
        },
        {
            name: "amount",
            description: `amount of codes`,
            type: 10,
            required: false,
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(interaction, client, args) {

        // As defined in the Schema, leave codes as an empty array variable
        let codes = [];

        const { guild, options, user } = interaction
        await interaction.deferReply({ ephemeral: true })

        if (user.id !== "424868316398747648") return EditReply(interaction, "❌", `This command is classified!`)

        // Display available plans of the code
        const plan = interaction.options.getString("plan");

        // Calculate time for the code to expire.
        let time;
        if (plan === "daily") time = Date.now() + 86400000;
        if (plan === "weekly") time = Date.now() + 86400000 * 7;
        if (plan === "monthly") time = Date.now() + 86400000 * 30;
        if (plan === "yearly") time = Date.now() + 86400000 * 365;

        // If the input is for ex. 10, generate 10 Codes. Default => 1 Code / Command.
        let amount = interaction.options.getNumber("amount");
        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
            const codePremium = voucher_codes.generate({
                pattern: "####-####-####",
            });

            // Save the Code as a String ("ABCDEF ...") in the Database
            const code = codePremium.toString().toUpperCase();

            // Security check, check if the code exists in the database.
            const find = await schema.findOne({
                code: code,
            });

            // If it does not exist, create it in the database.
            if (!find) {
                await schema.create({
                    code: code,
                    plan: plan,
                    expiresAt: time,
                });

                // Push the new generated Code into the Queue
                codes.push(`${i + 1}- ${code}`);
            }
        }

        // Lastly, we want to send the new Code(s) into the Channel.

        EditReply(interaction, '✅', `\`\`\`Generated +${codes.length}\n\n--------\n${codes.join(
            "\n"
        )}\n--------\n\nType - ${plan}\nExpires - ${moment(time).format(
            "dddd, MMMM Do YYYY"
        )}\`\`\`\nTo redeem, use \`/redeem <code>\``)

    }
}