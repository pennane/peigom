const sound = require('../functions/play-sound.js');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const Discord = require('discord.js');

const dancemoves = require('../../assets/misc/fortnite/dancemoves')

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

let info = {
    name: "fortnite",
    admin: true,
    syntax: "fortnite",
    desc: "tanssi eeppisiä fornite liikkeitä"
}

let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null
        let voiceChannel = userid ? msg.guild.members.get(userid).voiceChannel : msg.member.voiceChannel
        if (voiceChannel && !(msg.guild.voiceConnection)) {
            voiceChannel.join()
                .then(async connection => {
                    sound.play('./assets/sound/fortnite.mp3', msg, connection, client)
                        .then(resolve());
                    dancemoves.forEach((move, i) => {
                        setTimeout(() => {
                            msg.channel.send(move)
                        }, 7000 * i / dancemoves.length + 500);

                    })
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