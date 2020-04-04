const sound = require('../utilities/playSound.js');

const configuration = {
    name: "bruh",
    admin: false,
    syntax: "bruh",
    desc: "bruh sound effect #2",
    triggers: ["bruh", "bro"],
    type: ["sound"]
}


let soundfile = './assets/sound/bruv.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}

module.exports.configuration = configuration;