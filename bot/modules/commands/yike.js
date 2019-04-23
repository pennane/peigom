const sound = require('../functions/play-sound.js');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

let info = {
    name: "yike",
    admin: false,
    syntax: "yike",
    desc: "award yikes"
}

let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let userid = args[1] ? msg.guild.members.get(args[1].replace(/\D/g, '')) : false
        let voiceChannel = userid.voiceChannel 
        if (userid && voiceChannel && !(msg.guild.voiceConnection)) {
            voiceChannel.join()
                .then(async connection => {
                    sound.play('./assets/misc/yike/yike.mp3', msg, connection, client)
                        .then(resolve());
                        msg.channel.send(userid, {
                            file: "./assets/misc/yike/yike.jpg"
                        });
                });
        } else if (!voiceChannel && userid) {
            resolve();
            msg.channel.send(userid, {
                file: "./assets/misc/yike/yike.jpg"
            });
        } else if (!userid) {
            resolve();
            embed.setTitle(`Botin kommentti:`)
                .setDescription(`${msg.member.user.username} ei tollasille voi antaa yikejä.`);
            msg.channel.send(embed)
                .catch(error => console.info(error));
        } else{
            resolve();
        }

    });
}

module.exports.info = info;