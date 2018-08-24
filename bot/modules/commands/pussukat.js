const sound = require('../functions/play-sound.js');
const ffmpeg = require('ffmpeg');
const fs = require('fs');

var info = {
    name: "pussukat",
    admin: false,
    syntax: "pussukat",
    desc: "Soittaa satunnaisen Sussen pussukan."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    if (msg.member.voiceChannel) {
        var filearr = [];
        fs.readdirSync("./sound/sp").forEach(file => {
            filearr.push(file);
        });
        client.IsBusy = true;
        var dir = './sound/sp/' + filearr[Math.floor(Math.random() * filearr.length)];
        msg.member.voiceChannel.join()
            .then(connection => {
                sound.play(dir, msg, connection, client);

            });
    } else {
        msg.reply('mene eka jollekki voicechannelille kid.')
            .then(msg => {
            })
            .catch(error => console.info(error));
    }
}

exports.info = info;