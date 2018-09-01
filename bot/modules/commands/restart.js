const auth = require('../../config/authorize.json');

var info = {
    name: "restart",
    admin: true,
    syntax: "restart",
    desc: "Käynnistää websocketin uudelleen"
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        client.destroy()
            .then(() => {
                client.login(auth.token);
            })
            .catch(error => console.log(error));
        msg.delete(10000)
            .catch(err => console.log(err))
        resolve();
    });
}

exports.info = info;