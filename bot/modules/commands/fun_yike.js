const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "yike",
    admin: false,
    syntax: "yike \<@user>",
    desc: "award yikes",
    triggers: ["yike", "yikes", "+yike"],
    type: ["fun", "sound"]
}

let soundfile = './assets/misc/yike/yike.mp3';

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let targetUser = args[1] ? msg.guild.members.cache.get(args[1].replace(/\D/g, '')) : false;
        if (!targetUser) {
            resolve();
            embed.setTitle(`Botin kommentti:`)
                .setDescription(`${msg.member.user.username} ei tollasille voi antaa yikejä. (yike \<@user>)`);
            msg.channel.send(embed)
                .catch(error => console.info(error));
            return;
        }

        let voiceChannel = targetUser.voice.channel
        if (targetUser && voiceChannel && !(msg.guild.voiceConnection)) {
            sound.play({ soundfile, msg, client, args })
            msg.channel.send(targetUser, {
                files: [{
                    attachment: './assets/misc/yike/yike.jpg',
                    name: 'yike.jpg',
                }]
            });

        } else if (!voiceChannel && targetUser) {
            resolve();
            msg.channel.send(targetUser, {
                files: [{
                    attachment: './assets/misc/yike/yike.jpg',
                    name: 'yike.jpg',
                }]
            });
        } else {
            resolve();
        }

    });
}

module.exports.configuration = configuration;