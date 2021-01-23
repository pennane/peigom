const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const { queue } = require('../core/sound.js')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const configuration = {
    name: "queue",
    admin: false,
    syntax: "queue",
    desc: "näyttää jonossa olevat kipaleet",
    triggers: ["queue", "q", "keke", "jono"],
    type: ["music"],
    type: ["music"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.show({ guild: guild, msg: msg })
        resolve()
    });
}
module.exports.configuration = configuration;