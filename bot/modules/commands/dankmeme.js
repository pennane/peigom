const sound = require('../functions/playSound.js');
const ffmpeg = require("ffmpeg");
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

const meta = {
    name: "dankmeme",
    admin: false,
    syntax: "dankmeme",
    desc: "Soittaa satunnaisen dank meme -äänen."
}
let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let memeSound = ['./assets/sound/meme.mp3', './assets/sound/meme2.mp3', './assets/sound/meme3.mp3']
        let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null
        let voiceChannel = userid ? msg.guild.members.get(userid).voiceChannel : msg.member.voiceChannel
        if (voiceChannel && !(msg.guild.voiceConnection)) {
            voiceChannel.join()
                .then(connection => {
                    let randomSound = memeSound[Math.floor(Math.random() * memeSound.length)];
                    sound.play(randomSound, msg, connection, client)
                        .then(resolve())
                        .catch(error => {
                            reject(error);
                        });
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

module.exports.meta = meta;