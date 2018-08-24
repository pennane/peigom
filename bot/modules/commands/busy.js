var info = {
    name: "busy",
    admin: true,
    syntax: "busy",
    desc: "Kertoo onko botti 'kiireinen'. Käyttö debuggaamiseen."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    msg.channel.send('IsBusy: ' + client.IsBusy)
        .then(msg => {
            msg.delete(10000)
        })
        .catch(error => console.info(error));
    msg.delete(10000);
}

exports.info = info;