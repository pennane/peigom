var info = {
    name: "thonk",
    admin: false,
    syntax: "thonk",
    desc: "Lähettää kanavalle animoidun thonkin."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function(msg, client, args) {
    msg.channel.send('<a:thonk:443343009229045760>');
}

exports.info = info;