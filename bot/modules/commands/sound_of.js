const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "of",
    admin: false,
    syntax: "of",
    desc: "Soittaa of äänen",
    triggers: ["of"],
    type: ["sound"]
}

let soundfile = './assets/sound/of.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}

module.exports.configuration = configuration;