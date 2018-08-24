const sound = require('../functions/play-sound.js');
const ffmpeg = require("ffmpeg");

var info = {
    name: "dankmeme",
    admin: false,
    syntax: "dankmeme",
    desc: "Soittaa satunnaisen dank meme -äänen."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function(msg, client, args) {
            var memeSound = ['./sound/meme.mp3', './sound/meme2.mp3', './sound/meme3.mp3']
            if (msg.member.voiceChannel) {
                client.IsBusy = true;
                msg.member.voiceChannel.join()
                    .then(connection => {
                        var randomSound = memeSound[Math.floor(Math.random() * memeSound.length)];
                        sound.play(randomSound, msg, connection, client);
                    });
            } else {
                msg.reply('mene eka jollekki voicechannelille kid.')
                    .then(msg => {
                    })
                    .catch(error => console.info(error));
            }
}

exports.info = info;