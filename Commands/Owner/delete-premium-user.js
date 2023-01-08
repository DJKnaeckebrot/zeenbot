const User = require("../../Structures/Schemas/Premium");
const moment = require("moment");
const { Collection, MessageEmbed } = require("discord.js");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "delete-premium-user",
    description: "Deletes a premium Server",
    category: "Owner",
    options: [
        {
            name: "server",
            description: "Enter the Server ID",
            type: 3,
            required: true,
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(interaction, client, args) {

        let user = interaction.options.getString("server");
        console.log("Got from Interaction : " + user)
        // let data = client.userSettings.get(user);

        let Data = await User.findOne({ Id: user });

        // console.log(data)
        console.log(Data)

        if (!Data) {
            await  interaction.reply({ content: `**>❌ This Server is not a premium server**`, ephemeral: true })
            // return EditReply(interaction, "❌", `**> Server can't be found in database!**`)
        }

        if (!Data.isPremium) {
            await  interaction.reply({ content: `**>❌ This Server is not a premium server**`, ephemeral: true })
            // EditReply(interaction, "❌", `${user} is not a premium user!`);
        } else {
            await User.findOneAndRemove({ Id: user });
            await client.userSettings.delete(user);
            await interaction.reply({ content: `**>✅ Successfully removed premium from ${user}**`, ephemeral: true })
            // EditReply(interaction, "✅", `${user} is no longer a premium user!`);
            console.log("data row")
        }
    }
}