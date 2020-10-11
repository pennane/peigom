const zimmerChannelId = "759808413877796966";
const zimmerDate = new Date(`Mar 21, 2021 19:00:00`).getTime()

const schedule = require('node-schedule')

let zimmerTimer;

function timeDiff(d, ad) {
    let dist = Math.abs(d - ad);
    let days = Math.floor(dist / (1000 * 60 * 60 * 24));
    let hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days: days, hours: hours }
}

function editZimmerChannel(channel) {
    if (!channel) return console.log('zimmer channel not available')
    let remaining = timeDiff(zimmerDate, Date.now())
    if (!remaining.days) return console.log("could not resolve tj")
    if (!channel.editable) return console.log('zimmer channel not editable')

    let oldTJ = parseInt(channel.name.replace('Hans Zimmer TJ: ', ''))

    if (remaining.days >= oldTJ) return;

    channel.edit({
        name: "Hans Zimmer TJ: " + remaining.days
    })
}

module.exports = async (client) => {
    let channel = await client.channels.fetch(zimmerChannelId);
    editZimmerChannel(channel)
    zimmerTimer = schedule.scheduleJob('* */2 * * *', function () {
        console.log('yes zimmer')
        editZimmerChannel(channel)
    });
}