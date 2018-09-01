const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

var info = {
    name: "busy",
    admin: true,
    syntax: "busy",
    desc: "Kertoo onko botti 'kiireinen'. Käyttö debuggaamiseen."
}
let syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed.setTitle(`Onko botti 'kiireinen':`)
        embed.setDescription(`\`${client.IsBusy}\``)
        msg.channel.send(embed)
            .then(() => resolve())
            .catch(error => console.log(error));
    });
}

exports.info = info;