const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const { queue } = require('../core/sound.js')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const configuration = {
    name: "move",
    admin: false,
    syntax: "move",
    desc: "Siirtää botin tälle lähettäjän äänikanavalle",
    triggers: ["move", "siirrä", "mv"],
    type: ["music"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.changeChannel({ guild: guild, message: msg })
        resolve()
    });
}
module.exports.configuration = configuration;