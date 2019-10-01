const sound = require('../utilities/playSound.js');

const meta = {
    name: "bruh",
    admin: false,
    syntax: "bruh",
    desc: "bruh sound effect #2",
    triggers: ["bruh", "bro"]
}


let soundfile = './assets/sound/bruv.mp3'

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}

module.exports.meta = meta;