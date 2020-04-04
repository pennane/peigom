const sound = require('../utilities/playSound.js');

const configuration = {
    name: "vesi",
    admin: false,
    syntax: "vesi",
    desc: "nami nami",
    triggers: ["vesi", "vettä"],
    type: ["sound"]
}

let soundfile = './assets/sound/vesi.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}

module.exports.configuration = configuration;