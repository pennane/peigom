const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "yike",
    admin: false,
    syntax: "yike",
    desc: "award yikes",
    triggers: ["yike", "yikes", "+yike"],
    type: ["fun", "sound"]
}

let soundfile = './assets/misc/yike/yike.mp3';

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let userid = args[1] ? msg.guild.members.cache.get(args[1].replace(/\D/g, '')) : false
        let voiceChannel = userid.voice.channel
        if (userid && voiceChannel && !(msg.guild.voiceConnection)) {
            sound.play({ soundfile, msg, client, args })
            msg.channel.send(userid, {
                file: "./assets/misc/yike/yike.jpg"
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
        } else {
            resolve();
        }

    });
}

module.exports.configuration = configuration;