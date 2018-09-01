var info = {
    name: "sammuta",
    admin: true,
    syntax: "sammuta",
    desc: "Sammuttaa botin, uudelleenkäynnistys vain komentolinjan kautta."
}

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        msg.delete(1000)
            .catch(err => console.log(err))
        setTimeout(function () {
            client.destroy();
            process.exit();
        }, 2500);
        resolve();
    });
}

exports.info = info;