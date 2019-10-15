const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);

const meta = {
    name: "dankmeme",
    admin: false,
    syntax: "dankmeme",
    desc: "Soittaa satunnaisen dank meme -äänen.",
    triggers: ["dankmeme"],
    type:  ["sound"]
}

let memeSound = ['./assets/sound/meme.mp3', './assets/sound/meme2.mp3', './assets/sound/meme3.mp3']

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let soundfile = memeSound[Math.floor(Math.random() * memeSound.length)];
        
        sound.play({ soundfile, msg, client, args })
        resolve();
    });
}

module.exports.meta = meta;