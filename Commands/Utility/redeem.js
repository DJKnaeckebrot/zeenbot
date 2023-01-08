const { Client, ChatInputCommandInteraction, EmbedBuilder} = require("discord.js")
const moment = require("moment");
const schema = require("../../Structures/Schemas/PremiumVoucher");
const User = require("../../Structures/Schemas/Premium");
const EditReply = require("../../Systems/EditReply")
const TicketSetupDB = require("../../Structures/Schemas/TicketSetup");

module.exports = {
    name: "redeem",
    description: "Redeems a premium system for this guild",
    category: "Utility",
    options: [
        {
            name: "code",
            description: "Enter your premium code",
            type: 3,
            required: true
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(interaction, client, args) {

        const { guild } = interaction

        // Check if the user with a unique ID is in our database.
        let user = await User.findOne({
            Id: guild.id, // if you are using slash commands, swap message with interaction.
        });

        await interaction.deferReply({ ephemeral: false })

        // Check Users input for a valid code. Like `!redeem ABCD-EFGH-IJKL`
        let code = interaction.options.getString("code");

        // Return an error if the User does not include any Premium Code
        if (!code) {
            EditReply(interaction, "❌", `**Please specify the code you want to redeem!**`)
        }

        // If the user is already a premium user, we dont want to save that so we return it.
        if (user && user.isPremium) {
            return interaction.followUp(`**> You already are a premium server**`);
        }

        // Check if the code is valid within the database
        const premium = await schema.findOne({
            code: code.toUpperCase(),
        });

        if (!user) {
            user = new User({
                Id: guild.id,
                isPremium: false,
            })

            await user.save()
        }

        user = await User.findOne({ Id: guild.id })

        // Set the expire date for the premium code
        if (premium) {
            const expires = moment(premium.expiresAt).format(
                "dddd, MMMM Do YYYY HH:mm:ss"
            );

            // Once the code is expired, we delete it from the database and from the users profile
            user.isPremium = true;
            user.premium.redeemedBy.push(interaction.user);
            user.premium.redeemedAt = Date.now();
            user.premium.expiresAt = premium.expiresAt;
            user.premium.plan = premium.plan;

            // Save the User within the Database
            user = await user.save({ new: true }).catch(() => {});

            client.userSettings.set(guild.id, user);

            await premium.deleteOne().catch(() => {});

            // Send a success message once redeemed
            EditReply(interaction, "✅", `**> Successfully redeemed your premium code! Expires at: ${expires}**`);

            // Error message if the code is not valid.
        } else {
            EditReply(interaction, "❌", `**> Invalid code! Please try again using valid one!**`);
        }

    }
}