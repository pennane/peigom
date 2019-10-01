const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);

const meta = {
    name: "zipmint",
    admin: false,
    syntax: "zipmint",
    desc: "Soittaa tsipmint äänen",
    triggers: ["zip", "zipmint", "tsipmint"]
}
let soundfile = './assets/sound/zipmint.mp3'

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}
module.exports.meta = meta;