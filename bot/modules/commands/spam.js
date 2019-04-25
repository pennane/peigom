const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

const meta = {
    name: "spam",
    admin: true,
    syntax: "spam <@pelaaja> <määrä> <viesti>",
    desc: "Lähettää asettamasi viestin asettamallesi pelaajalle asettamasi monta kertaa."
}
let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed.setDescription(`\`${syntax}\``)
            .setTitle(`Komento ${info.name} toimii näin:`);
        if (args[3]) {
            let userid = args[1].replace(/\D/g, '');
            if (msg.guild.members.get(userid)) {
                if (typeof (args[2]) !== 'string') {
                    args[2] = args[2].toString();
                }
                if (args[4]) {
                    for (let i = 4; i < args.length; i++) {
                        args[3] = args[3] + ' ' + args[i];
                    }
                }
                for (let i = 0; i < args[2]; i++) {
                    msg.guild.members.get(userid)
                        .send(args[3]);
                }
            } else {
                msg.channel.send(embed)
                    .then(msg => {
                        msg.delete(15001)
                    })
                    .catch(err => console.info(error));
            }
        } else {
            msg.channel.send(embed)
                .then(msg => {
                    msg.delete(15001)
                })
                .catch(err => console.info(error));
        }
        msg.delete(5000);

        resolve();
    });
}

module.exports.meta = meta;