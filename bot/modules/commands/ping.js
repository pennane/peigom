var info = {
    name: "ping",
    admin: false,
    syntax: "ping",
    desc: "Kertoo botin viiveen"
}

module.exports = exports = {};

exports.run = function(msg, client, args) {
    msg.reply("Pong: " + (Date.now() - msg.createdTimestamp) + "ms");
}

exports.info = info;