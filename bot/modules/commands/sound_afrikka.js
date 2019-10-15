const sound = require('../utilities/playSound.js');

const meta = {
    name: "afrikka",
    admin: false,
    syntax: "afrikka",
    desc: "tsiubidiubi",
    triggers: ["afrikka", "africa"],
    type:  ["sound"]
}

let soundfile = './assets/sound/afrikka.mp3'

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })
        resolve();
    });
}

module.exports.meta = meta;