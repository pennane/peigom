const sound = require('../functions/play-sound.js');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);


let info = {
    name: "imgonnasaythenword",
    admin: false,
    syntax: "imgonnasaythenword",
    desc: "thats racist, you cannot say the nword"
}
let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (msg.member.voiceChannel && !(msg.guild.voiceConnection)) {
            let filearr = ["nword.mp3","nword2.mp3"];
            let dir = './assets/sound/' + filearr[Math.floor(Math.random() * filearr.length)];
            msg.member.voiceChannel.join()
                .then(connection => {
                    sound.play(dir, msg, connection, client)
                        .then(resolve())
                        .catch(error => console.log(error));

                })
                .catch(error => console.log(error));
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