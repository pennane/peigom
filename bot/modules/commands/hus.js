var info = {
    name: "hus",
    admin: false,
    syntax: "hus",
    desc: "Heittää botin pois äänikanavalta."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (msg.guild.voiceConnection.dispatcher) {
            msg.guild.voiceConnection.dispatcher.end();
        }
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.leave();
            client.IsBusy = false;
        }
        resolve();
    });
}

exports.info = info;