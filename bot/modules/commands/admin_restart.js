const auth = require('../../config/authorize.json');

const meta = {
    name: "restart",
    admin: true,
    syntax: "restart",
    desc: "Käynnistää websocketin uudelleen",
    triggers: ["restart", "reboot"],
    type:  ["admin"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        client.destroy()
            .then(() => {
                client.login(auth.token);
            })
            .catch(error => console.info(error));
        msg.delete(10000)
            .catch(err => console.info(err))
        resolve();
    });
}

module.exports.meta = meta;