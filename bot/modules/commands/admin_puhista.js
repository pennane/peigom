const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "puhista",
    admin: true,
    syntax: "puhista <määrä (2-99)>",
    desc: "Poistaa annetun määrän viestejä kanavalta.",
    triggers: ["puhista", "puhdista"],
    type: ["admin"]
}

embed.setTitle("Botin kommentti:");

module.exports = {
    executor: (msg, client, args) => {
        return new Promise((resolve, reject) => {
            if (args[1] >= 2 && args[1] <= 99) {
                embed.setDescription(`Poistin ${args[1]} viestiä.`)
                let todel = parseInt(args[1]) + 1;
                msg.channel.bulkDelete(todel)
                    .then(() => {
                        msg.channel.send(embed)
                            .then(msg => msg.delete(4000))
                            .catch(err => console.info(err))
                    })
                    .catch(error => console.error(error));
            } else {
                let embed = syntaxEmbed({ configuration, args })
                msg.channel.send(embed).catch(err => console.info(err))
            }
            resolve();
        });
    },
    configuration: configuration
}