const sound = require('../functions/play-sound.js');
const ffmpeg = require('ffmpeg');
const fs = require('fs');

var info = {
    name: "pussukat",
    admin: false,
    syntax: "pussukat",
    desc: "Soittaa satunnaisen kappaleen botin pussukat kansiosta"
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (msg.member.voiceChannel && !(msg.guild.voiceConnection)) {
            var filearr = [];
            fs.readdirSync("./sound/pussukat").forEach(file => {
                filearr.push(file);
            });
            client.IsBusy = true;
            var dir = './sound/pussukat/' + filearr[Math.floor(Math.random() * filearr.length)];
            msg.member.voiceChannel.join()
                .then(connection => {
                    sound.play(dir, msg, connection, client)
                    .then(resolve())
                    .catch(error => console.log(error));

                })
                .catch(error => console.log(error));
            } else if (!msg.member.voiceChannel) {
                resolve();
                msg.reply('mene eka jollekki voicechannelille kid.')
                    .then(msg => {
                    })
                    .catch(error => console.info(error));
            } else {
                resolve();
            }
    });
}

exports.info = info;