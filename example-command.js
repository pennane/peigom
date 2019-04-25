const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542)
    .setTitle("Botin kommentti:")
    .setDescription("example");

const meta = {
    name: "example",
    admin: false,
    syntax: "example <amount> <@who>",
    desc: "description for ,example",
    triggers: ["example"]
}


module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        /*
        COMMAND LOGIC HERE
        MOVE COMPLETED FILE TO ./modules/commands/
        */
        resolve();
    })

}

module.exports.meta = meta;