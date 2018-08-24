const Discord = require('discord.js');
var exports = module.exports = {};
exports.play = function (filename, msg, connection, client) {
    return new Promise((resolve, reject) => {
        var dispatcher = connection.playFile(filename);
        dispatcher.on("end", end => {
            client.IsBusy = false;
            if (msg.member.voiceChannel) {
                msg.member.voiceChannel.leave();
                    
                client.IsBusy = false;
            }

        });
        resolve();
    });
}