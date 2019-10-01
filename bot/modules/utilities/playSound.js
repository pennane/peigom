const Discord = require('discord.js');

const logger = require('./activityLogger')
const { queue } = require('../core/sound.js')



module.exports.play = async function ({ soundfile, msg, client, args }) {
    let embed = new Discord.RichEmbed().setColor(0xF4E542);

    let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null;
    let voiceChannel = userid ? msg.guild.members.get(userid).voiceChannel : msg.member.voiceChannel

    if (await !voiceChannel) {
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

        broadcast = client.createVoiceBroadcast();
        broadcast.playFile(soundfile);

        const dispatcher = connection.playBroadcast(broadcast);

        broadcast.on("end", reason => {
            if (msg.guild.me.voiceChannel) {
                msg.guild.me.voiceChannel.leave();
            }
        });

        broadcast.on('error', error => {
            throw error;
        });


    } catch (err) {
        logger.log(3, `Error while playing audio: ${err}`)
    }

}