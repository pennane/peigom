const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);

const meta = {
    name: "puhista",
    admin: true,
    syntax: "puhista <määrä (2-99)>",
    desc: "Poistaa annetun määrän viestejä kanavalta.",
    triggers: ["puhista", "puhdista"],
    type:  ["admin"]
}

embed.setTitle("Botin kommentti:");

module.exports = {
    run: (msg, client, args) => {
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
                embed.setTitle(`Komento ${meta.name} toimii näin:`)
                    .setDescription(`\`${meta.syntax}\``)
                msg.channel.send(embed)
                    .catch(err => console.info(err))
            }
            resolve();
        });
    },
    meta: meta
}