const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);


const meta = {
    name: "imgonnasaythenword",
    admin: false,
    syntax: "imgonnasaythenword",
    desc: "thats racist, you cannot say the nword",
    triggers: ["imgonnasaythenword", "nword"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let filearr = ["nword.mp3", "nword2.mp3"];
        let dir = './assets/sound/' + filearr[Math.floor(Math.random() * filearr.length)];
        let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null
        let voiceChannel = userid ? msg.guild.members.get(userid).voiceChannel : msg.member.voiceChannel
        if (voiceChannel && !(msg.guild.voiceConnection)) {
            voiceChannel.join()
                .then(connection => {
                    sound.play(dir, msg, connection, client)
                        .then(resolve())
                        .catch(error => console.info(error));

                })
                .catch(error => console.info(error));
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