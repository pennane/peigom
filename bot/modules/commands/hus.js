var info = {
    name: "hus",
    admin: false,
    syntax: "hus",
    desc: "Heittää botin pois äänikanavalta."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function(msg, client, args) {
    if (msg.member.voiceChannel) {
        msg.member.voiceChannel.leave();
        client.IsBusy = false;
    }
}

exports.info = info;