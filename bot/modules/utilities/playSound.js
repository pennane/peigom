const Discord = require('discord.js');

const logger = require('./activityLogger')
const { queue } = require('../core/sound.js')


module.exports.play = async function ({ soundfile, msg, client, args }) {

    let embed = new Discord.MessageEmbed().setColor(0xF4E542);

    let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null;

    let voiceChannel = userid ? msg.guild.members.cache.get(userid).voice.channel : msg.member.voice.channel

    if (!voiceChannel) {
        embed.setTitle(`Botin kommentti:`)
            .setDescription(`${msg.member.user.username} mene eka jollekki voicechannelille, kid.`);
        msg.channel.send(embed)
            .catch(error => console.info(error));
        return null;
    }

    if (queue.isPlaying({ guild: msg.guild })) {
        embed.setTitle(`Botin kommentti:`)
            .setDescription(`${msg.member.user.username} sul on jo musat tulilla, kid.`);
        msg.channel.send(embed)
            .catch(error => console.info(error));
        return null;
    }

    if (voiceChannel.connection && voiceChannel.connection.speaking) {
        return null;
    }

    let connection;

    if (voiceChannel.connection) {
        connection = voiceChannel.connection
    } else {
        connection = await voiceChannel.join()
    }

    try {

        const dispatcher = connection.play(soundfile);

        dispatcher.on('finish', reason => {
            if (msg.guild.me.voice.channel) {
                msg.guild.me.voice.channel.leave();
            }
        });

        dispatcher.on('error', error => {
            throw error;
        });

    } catch (err) {
        logger.log(3, `Error while playing audio: ${err}`)
    }

}