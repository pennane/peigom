const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const meta = {
    name: "ooof",
    admin: false,
    syntax: "ooof",
    desc: "elongated oof",
    triggers: ["ooof"],
    type: ["sound"]
}


let soundfile = './assets/sound/ooof.mp3'

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}
module.exports.meta = meta;