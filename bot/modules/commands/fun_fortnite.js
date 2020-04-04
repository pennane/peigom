const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

const dancemoves = require('../../assets/misc/fortnite/dancemoves')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "fortnite",
    admin: false,
    syntax: "fortnite",
    desc: "tanssi eeppisiä fornite liikkeitä",
    triggers: ["fortnite", "fortnight", "fornite"],
    type: ["fun", "sound"]
}

let soundfile = './assets/sound/fortnite.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null
        let voiceChannel = userid ? msg.guild.members.cache.get(userid).voice.channel : msg.member.voice.channel
        if (voiceChannel && !(msg.guild.voiceConnection)) {
            voiceChannel.join()
                .then(async connection => {
                    sound.play({ soundfile, msg, client, args })
                    dancemoves.forEach((move, i) => {
                        setTimeout(() => {
                            msg.channel.send(move)
                        }, 7000 * i / dancemoves.length + 500);

                    })
                });
        } else if (!msg.member.voice.channel) {
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

module.exports.configuration = configuration;
