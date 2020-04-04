const configuration = {
    name: "emojis",
    admin: false,
    syntax: "emojis",
    desc: "Lähettää kanavalle kaikki botin tuntemat emojit",
    triggers: ["emojis", "emojit"],
    type: ["utility", "fun"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let emojis = client.emojis.cache;
        let message = '';
        emojis.forEach(emoji => {
            if (!emoji.available) return;
            message += emoji.toString() + " ";

        })
        console.log(message)
        msg.channel.send(message)
            .catch(err => console.info(err));
        resolve();
    });
}

module.exports.configuration = configuration;