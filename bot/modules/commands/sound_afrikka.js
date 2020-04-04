const sound = require('../utilities/playSound.js');

const configuration = {
    name: "afrikka",
    admin: false,
    syntax: "afrikka",
    desc: "tsiubidiubi",
    triggers: ["afrikka", "africa"],
    type: ["sound"]
}

let soundfile = './assets/sound/afrikka.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })
        resolve();
    });
}

module.exports.configuration = configuration;