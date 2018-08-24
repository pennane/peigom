var info = {
    name: "ping",
    admin: false,
    syntax: "ping",
    desc: "Kertoo botin viiveen"
}

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        msg.reply("Pong: " + (Date.now() - msg.createdTimestamp) + "ms");
        resolve();
    });
}

exports.info = info;