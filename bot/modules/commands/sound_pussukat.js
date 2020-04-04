const sound = require('../utilities/playSound.js');
const fs = require('fs');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const configuration = {
    name: "pussukat",
    admin: false,
    syntax: "pussukat",
    desc: "Soittaa satunnaisen kappaleen botin pussukat kansiosta",
    triggers: ["pussukat", "pussukka"],
    type: ["sound"]
}

let filearr = [];
fs.readdirSync("./assets/sound/pussukat").forEach(file => {
    filearr.push(file);
});

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let soundfile = './assets/sound/pussukat/' + filearr[Math.floor(Math.random() * filearr.length)];
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}


module.exports.configuration = configuration;