const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const { queue } = require('../core/sound.js')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const meta = {
    name: "resume",
    admin: false,
    syntax: "resume",
    desc: "palauttaa kipaleen",
    triggers: ["resume"],
    type: ["music"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.resume({ guild: guild, msg: msg })
        resolve()
    });
}
module.exports.meta = meta;