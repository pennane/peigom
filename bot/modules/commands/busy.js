var info = {
    name: "busy",
    admin: true,
    syntax: "busy",
    desc: "Kertoo onko botti 'kiireinen'. Käyttö debuggaamiseen."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
    msg.channel.send('IsBusy: ' + client.IsBusy)
        .then(msg => {
            msg.delete(10000)
            resolve();
        })
        .catch(error => {
            console.log(error)
        });
    msg.delete(10000);
    });
}

exports.info = info;