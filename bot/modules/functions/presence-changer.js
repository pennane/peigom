const schedule = require('node-schedule');

module.exports.set = function (client) {
    let presence = client.config.discord.presence;

    if (client.config.get("discord.presence.activities").length === 1) {
        client.user.setActivity(presence.activities[0], {type: client.config.discord.presence.type});
    } else {
        let rand = Math.floor(Math.random() * presence.activities.length);
        let timing = Date.now();
        let i = rand;
        client.user.setActivity(presence.activities[rand], {type: client.config.discord.presence.type});
        let activityTimer = schedule.scheduleJob(`*/${presence.refreshrate} * * * *`, function (fireDate) {
            client.user.setActivity(client.config.get('discord.presence.activities')[i], {type: client.config.discord.presence.type});
            if (i === presence.activities.length - 1) {
                i = 0;
            } else {
                i++;
            }
        });
    }
}