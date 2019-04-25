const logger = require('./activityLogger')

module.exports.play = function (filename, msg, connection, client) {
    return new Promise((resolve, reject) => {
        try {
            let dispatcher = connection.playFile(filename);
            dispatcher.on("end", end => {
                if (msg.guild.me.voiceChannel) {
                    msg.guild.me.voiceChannel.leave();
                }
            });
        } catch (err) {
            logger.log(3, err)
        }

        resolve();
    });
}