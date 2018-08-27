const schedule = require('node-schedule');

var exports = module.exports = {};
exports.set = function (client) {
    var presence = client.config.discord.presence;

    if (client.config.get("discord.presence.activities").length === 1) {
        client.user.setActivity(presence.activities[0], {type: client.config.discord.presence.type});
    } else {
        var rand = Math.floor(Math.random() * presence.activities.length);
        var timing = Date.now();
        var i = rand;
        client.user.setActivity(presence.activities[rand], {type: client.config.discord.presence.type});
        var activityTimer = schedule.scheduleJob(`*/${presence.refreshrate} * * * *`, function (fireDate) {
            client.user.setActivity(client.config.get('discord.presence.activities')[i], {type: client.config.discord.presence.type});
            if (i === presence.activities.length - 1) {
                i = 0;
            } else {
                i++;
            }
        });
    }
}