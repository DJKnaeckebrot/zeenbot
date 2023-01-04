const { Client, GuildMember, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "guildMemberRemove",

    /**
     *
     * @param {GuildMember} member
     * @param {Client} client
     * @returns {Promise<*>}
     */
    async execute(member, client) {

        const { guild, user } = member

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.MemberLeft === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Member Left`)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: `${user.id}` })
            .setTimestamp()



        let joinedTime = member.joinedAt;
        let joinedTimeFormatted = joinedTime.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

        const time = timeDifference(joinedTime, new Date());

        if (time.years > 0) {
            return Channel.send({
                embeds: [
                    Embed
                        .setDescription(`<@${user.id}> \n Joined: ${joinedTimeFormatted} \n Time on Server: ${time.years} Years, ${time.months} Months, ${time.days} Days, ${time.hours} Hours, ${time.minutes} Minutes, ${time.seconds} Seconds`)
                ]
            })
        } else if (time.months > 0) {
            return Channel.send({
                embeds: [
                    Embed
                        .setDescription(`<@${user.id}> \n Joined: ${joinedTimeFormatted} \n Time on Server: ${time.months} Months, ${time.days} Days, ${time.hours} Hours, ${time.minutes} Minutes, ${time.seconds} Seconds`)
                ]
            })
        } else if (time.days > 0) {
            return Channel.send({
                embeds: [
                    Embed
                        .setDescription(`<@${user.id}> \n Joined: ${joinedTimeFormatted} \n Time on Server: ${time.days} Days, ${time.hours} Hours, ${time.minutes} Minutes, ${time.seconds} Seconds`)
                ]
            })
        } else if (time.hours > 0) {
            return Channel.send({
                embeds: [
                    Embed
                        .setDescription(`<@${user.id}> \n Joined: ${joinedTimeFormatted} \n Time on Server: ${time.hours} Hours, ${time.minutes} Minutes, ${time.seconds} Seconds`)
                ]
            })
        } else if (time.minutes > 0) {
            return Channel.send({
                embeds: [
                    Embed
                        .setDescription(`<@${user.id}> \n Joined: ${joinedTimeFormatted} \n Time on Server: ${time.minutes} Minutes, ${time.seconds} Seconds`)
                ]
            })
        } else if (time.minutes < 0) {
            return Channel.send({
                embeds: [
                    Embed
                        .setDescription(`<@${user.id}> \n Joined: ${joinedTimeFormatted} \n Time on Server: ${time.seconds} Seconds`)
                ]
            })
        }
    }
}

function timeDifference(date1, date2) {
    let diffInMilliseconds = Math.abs(date1 - date2);

    // Calculate the time difference in years
    const years = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    diffInMilliseconds -= years * (1000 * 60 * 60 * 24 * 365.25);

    // Calculate the time difference in months
    const months = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.436875));
    diffInMilliseconds -= months * (1000 * 60 * 60 * 24 * 30.436875);

    // Calculate the time difference in days
    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    diffInMilliseconds -= days * (1000 * 60 * 60 * 24);

    // Calculate the time difference in hours
    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    diffInMilliseconds -= hours * (1000 * 60 * 60);

    // Calculate the time difference in minutes
    const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
    diffInMilliseconds -= minutes * (1000 * 60);

    // Calculate the time difference in seconds
    const seconds = Math.floor(diffInMilliseconds / 1000);

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds
    };
}
