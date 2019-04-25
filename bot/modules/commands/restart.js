const auth = require('../../config/authorize.json');

const meta = {
    name: "restart",
    admin: true,
    syntax: "restart",
    desc: "Käynnistää websocketin uudelleen"
}
let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
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

module.exports.meta = meta;