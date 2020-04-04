const Discord = require('discord.js');

const { queue } = require('../core/sound.js')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const configuration = {
    name: "np",
    admin: false,
    syntax: "np",
    desc: "näyttää tällä hetkellä soivan kipaleen",
    triggers: ["np", "nowplaying"],
    type: ["music"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.nowPlaying({ guild: guild, msg: msg })
        resolve()
    });
}
module.exports.configuration = configuration;