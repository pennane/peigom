var info = {
    name: "uptime",
    admin: false,
    syntax: "uptime",
    desc: "Kertoo botin tähänastisen käynnissäoloajan"
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    var uptime = {};
    uptime.ms = (client.uptime);
    uptime.ts = (client.uptime / 1000);
    uptime.h = Math.trunc(uptime.ts / 3600);
    uptime.tsr = uptime.ts % 3600;
    uptime.m = Math.trunc(uptime.tsr / 60);
    uptime.s = Math.trunc(uptime.tsr % 60);
    uptime.msg = {
        "h": "",
        "m": "",
        "s": ""
    };
    if (uptime.h > 1) {
        uptime.msg.h = `**${uptime.h}** tuntia, `;
    } else if (uptime.h === 1) {
        uptime.msg.h = `**${uptime.h}** tunnin `;
    }
    else if (uptime.m > 1) {
        uptime.msg.m = `**${uptime.m}** minuuttia `;
    } else if (uptime.m === 1) {
        uptime.msg.m = `**${uptime.m}** minuutin `;
    } else if (uptime.s > 1) {
        uptime.msg.s = `**${uptime.s}** sekuntia`;
    } else if (uptime.s <= 1) {
        uptime.msg.s = `**1** sekunnin`;
    }

    uptime.msg.complete = `Tää botti o ollu hereillä jo ${uptime.msg.h}${uptime.msg.m}${uptime.msg.s} :hourglass_flowing_sand:`

    msg.channel.send(uptime.msg.complete);
}

exports.info = info;