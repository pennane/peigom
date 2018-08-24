const sound = require('../functions/play-sound.js');
const ffmpeg = require("ffmpeg");

var info = {
    name: "oof",
    admin: false,
    syntax: "oof",
    desc: "Soittaa oof äänen"
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function(msg, client, args) {
    if (msg.member.voiceChannel) {
        client.IsBusy = true;
        msg.member.voiceChannel.join()
            .then(connection => {
                sound.play('./sound/oof.mp3', msg, connection, client);
            });
    } else {
        msg.reply('mene eka jollekki voicechannelille kid.')
            .then(msg => {
            })
            .catch(error => console.info(error));
    }

}
exports.info = info;