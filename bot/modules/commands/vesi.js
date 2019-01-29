const sound = require('../functions/play-sound.js');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);


let info = {
    name: "vesi",
    admin: false,
    syntax: "vesi",
    desc: "nami nami"
}
let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (msg.member.voiceChannel && !(msg.guild.voiceConnection)) {
            msg.member.voiceChannel.join()
                .then(connection => {
                    sound.play('./assets/sound/vesi.mp3', msg, connection, client)
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

module.exports.info = info;