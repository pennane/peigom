var exports = module.exports = {};
exports.play = function (filename, msg, connection) {
    var dispatcher = connection.playFile(filename);
    dispatcher.on("end", end => {
        IsBusy = false;
        msg.member.voiceChannel.leave();
    });
}