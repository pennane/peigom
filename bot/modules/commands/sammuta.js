var info = {
    name: "sammuta",
    admin: true,
    syntax: "sammuta",
    desc: "Sammuttaa botin, uudelleenkäynnistys vain komentolinjan kautta."
}

module.exports = exports = {};

exports.run = function(msg, client, args) {
        msg.delete(1000);
        setTimeout(function () {
            client.destroy();
            process.exit();
        }, 2500);
}

exports.info = info;