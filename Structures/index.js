const { Client, Partials, Collection, EmbedBuilder } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
require("dotenv").config()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const nodes = require("../Systems/Nodes")
const { Manager } = require("erela.js")
const GeneralLogsDB = require("../Structures/Schemas/LogsChannel")

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "roles", "users"] },
    rest: { timeout: ms("1m") }
})

client.color = "Blue"
client.commands = new Collection()

const { DiscordTogether } = require("discord-together")
client.discordTogether = new DiscordTogether(client)

client.player = new Manager({
    nodes,
    send: (id, payload) => {

        let guild = client.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)

    }
})

process.on("unhandledRejection", (reason, p) => {
    const ChannelID = GeneralLogsDB.findOne({ Guild: client.guild.id }).catch(err => console.log(err))
    console.error("Unhandled promise rejection:", reason, p);
    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: "⚠️Anti Crash system" })
        .setTitle("Error Encountered");
    const logChannel = client.channels.cache.get(ChannelID);
    if (!Channel) return;
    logChannel.send({
        embeds: [
            Embed.setDescription(
                "**Unhandled Rejection/Catch:\n\n** ```" + reason + "```"
            ),
        ],
    });
});

client.on("raw", (d) => client.player.updateVoiceState(d))

const Handlers = ["Events", "Commands", "EventStack", "Errors", "Player"]
    client.voiceGenerator = new Collection();

Handlers.forEach(handler => {

    require(`./Handlers/${handler}`)(client, PG, Ascii)

})

client.giveawayConfig = require("./config.js");

['giveawaysEventsHandler', 'giveawaysManager'].forEach((x) => { // make sure it's in the right order
    require(`../Utils/${x}`)(client);
})

module.exports = client

client.login(process.env.TOKEN)