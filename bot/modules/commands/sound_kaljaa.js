const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "kaljaa",
    admin: false,
    syntax: "kaljaa",
    desc: "tsiubidiubi",
    triggers: ["kalja", "kaljaa"],
    type:  ["sound"]
}

let soundfile = './assets/sound/kaljaa.mp3'

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}
module.exports.meta = meta;