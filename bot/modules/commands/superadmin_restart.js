const auth = require('../../config/authorize.json');

const configuration = {
    name: "restart",
    admin: true,
    superadmin: true,
    syntax: "restart",
    desc: "'Käynnistää' websocketin uudelleen",
    triggers: ["restart", "reboot"],
    type: ["admin"]
}

module.exports.executor = function (msg, client, args) {
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

module.exports.configuration = configuration;