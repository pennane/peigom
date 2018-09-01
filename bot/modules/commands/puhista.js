const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

var info = {
    name: "puhista",
    admin: true,
    syntax: "puhista <määrä (2-99)>",
    desc: "Poistaa annetun määrän viestejä kanavalta."
}

embed.setTitle("Botin kommentti:");


var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (args[1] >= 2 && args[1] <= 99) {
            embed.setDescription(`Poistin ${args[1]} viestiä.`)
            let todel = parseInt(args[1]) + 1;
            msg.channel.bulkDelete(todel)
                .then(() => {
                    msg.channel.send(embed)
                        .then(msg => msg.delete(4000))
                        .catch(err => console.log(err))
                })
                .catch(error => console.error(error));
        } else {
            embed.setTitle(`Komento ${info.name} toimii näin:`)
                .setDescription(`\`${syntax}\``)
            msg.channel.send(embed)
                .catch(err => console.log(err))
        }
        resolve();
    });
}

exports.info = info;