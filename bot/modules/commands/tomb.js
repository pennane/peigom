const sound = require('../functions/play-sound.js');
const ffmpeg = require("ffmpeg");

var info = {
    name: "tomb",
    admin: false,
    syntax: "tomb",
    desc: "Lähettää kanavalle tomb viestit."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function(msg, client, args) {
    msg.channel.send('NYT RIITTAEAE VANDALISOINTI')
        .then(msg => {

        })
        .catch(error => console.info(error));
    setTimeout(function () {
        msg.channel.send('TAEAE ON NYT TEIKAEN HAUTA')
            .then(msg => {

            })
            .catch(error => console.info(error));
        setTimeout(function () {
            msg.channel.send('OLET HERAETTYNYT MEIDAET')
                .then(msg => {

                })
                .catch(error => console.info(error));
        }, 1500)
    }, 1500);
}
exports.info = info;