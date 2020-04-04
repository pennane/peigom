const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "zipmint",
    admin: false,
    syntax: "zipmint",
    desc: "Soittaa tsipmint äänen",
    triggers: ["zip", "zipmint", "tsipmint"],
    type: ["sound"]
}
let soundfile = './assets/sound/zipmint.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}
module.exports.configuration = configuration;