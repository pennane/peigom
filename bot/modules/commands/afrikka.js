const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "afrikka",
    admin: false,
    syntax: "afrikka",
    desc: "tsiubidiubi",
    triggers: ["afrikka", "africa"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null
        let voiceChannel = userid ? msg.guild.members.get(userid).voiceChannel : msg.member.voiceChannel
        if (voiceChannel && !(msg.guild.voiceConnection)) {
            voiceChannel.join()
                .then(connection => {
                    sound.play('./assets/sound/afrikka.mp3', msg, connection, client)
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
module.exports.meta = meta;