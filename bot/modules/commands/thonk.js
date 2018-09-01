var info = {
    name: "thonk",
    admin: false,
    syntax: "thonk",
    desc: "Lähettää kanavalle animoidun thonkin."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        msg.channel.send('<a:thonk:443343009229045760>')
            .catch(err => console.log(err))
        resolve();
    });
}

exports.info = info;