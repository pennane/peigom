const configuration = {
    name: "sammuta",
    admin: true,
    superadmin: true,
    syntax: "sammuta",
    desc: "Sammuttaa botin, uudelleenkäynnistys vain komentolinjan kautta.",
    triggers: ["sammuta", "shutdown"],
    type: ["admin"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        msg.delete(1000)
            .catch(err => console.info(err))
        setTimeout(function () {
            client.destroy();
            process.exit();
        }, 2500);
        resolve();
    });
}

module.exports.configuration = configuration;