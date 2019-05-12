const Discord = require('discord.js');

const { queue } = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "np",
    admin: false,
    syntax: "np",
    desc: "näyttää tällä hetkellä soivan kipaleen",
    triggers: ["np", "nowplaying"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.nowPlaying({guild: guild, msg: msg})
        resolve()
    });
}
module.exports.meta = meta;