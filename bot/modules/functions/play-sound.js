const Discord = require('discord.js');
module.exports.play = function (filename, msg, connection, client) {
    return new Promise((resolve, reject) => {
        let dispatcher = connection.playFile(filename);
        dispatcher.on("end", end => {
            if (msg.guild.me.voiceChannel) {
                msg.guild.me.voiceChannel.leave();       
            }
        });
        resolve();
    });
}