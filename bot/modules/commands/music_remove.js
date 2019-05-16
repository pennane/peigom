const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const {queue} = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "remove",
    admin: false,
    syntax: "remove <jonon numero>",
    desc: "Poistaa kipaleen jonosta",
    triggers: ["remove", "poista", "rm"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.remove({guild: guild, msg: msg, toRemove: args[1]})
        resolve()
    });
}
module.exports.meta = meta;