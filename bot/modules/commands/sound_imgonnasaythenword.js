const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed()
    .setColor(0xF4E542);


const meta = {
    name: "imgonnasaythenword",
    admin: false,
    syntax: "imgonnasaythenword",
    desc: "thats racist, you cannot say the nword",
    triggers: ["imgonnasaythenword", "nword"],
    type: ["sound"]
}

let filearr = ["nword.mp3", "nword2.mp3"];

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let soundfile = './assets/sound/' + filearr[Math.floor(Math.random() * filearr.length)];
        sound.play({ soundfile, msg, client, args })

        resolve();
    });
}

module.exports.meta = meta;