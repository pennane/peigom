var exports = module.exports = {};
exports.play = function (filename, msg, connection, client) {
    var dispatcher = connection.playFile(filename);
    dispatcher.on("end", end => {
        client.IsBusy = false;
        msg.member.voiceChannel.leave();
    });
}