const logger = require('./activityLogger')

module.exports.play = function (filename, msg, connection, client) {
    return new Promise((resolve, reject) => {
        try {
            let dispatcher = connection.playFile(filename);
            dispatcher.on("end", reason => {
                if (msg.guild.me.voiceChannel) {
                    msg.guild.me.voiceChannel.leave();
                }
            });
            dispatcher.on('error', e => {
                console.info(e);
              });
              
        } catch (err) {
            logger.log(3, `Error while playing audio: ${err}`)
        }
        resolve();
    });
}