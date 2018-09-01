const sound = require('../functions/play-sound.js');
const ffmpeg = require("ffmpeg");
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542); 0

var info = {
    name: "oof",
    admin: false,
    syntax: "oof",
    desc: "Soittaa oof äänen"
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (msg.member.voiceChannel && !(msg.guild.voiceConnection)) {
            client.IsBusy = true;
            msg.member.voiceChannel.join()
                .then(connection => {
                    sound.play('./sound/oof.mp3', msg, connection, client)
                        .then(resolve());
                });
        } else if (!msg.member.voiceChannel) {
            resolve();
            embed.setTitle(`Botin kommentti:`)
            .setDescription(`${msg.member.user.username} mene eka jollekki voicechannelille, kid.`);
            msg.channel.send(embed)
                .catch(error => console.info(error));
        } else {
            resolve();
        }

    });
}
exports.info = info;