const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

const meta = {
    name: "spam",
    admin: true,
    superadmin: true,
    syntax: "spam <@pelaaja> <määrä> <viesti>",
    desc: "Lähettää asettamasi viestin asettamallesi pelaajalle asettamasi monta kertaa.",
    triggers: ["spam"],
    type: ["admin"]
}

let embed = syntaxEmbed({ meta })

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {

        if (!args[3]) {
            msg.channel.send(embed).then(msg => {
                msg.delete(15001)
            })
            msg.delete(5000);
            return resolve()
        }

        let userid = args[1].replace(/\D/g, '');

        if (!msg.guild.members.cache.get(userid)) {
            msg.channel.send(embed).then(msg => {
                msg.delete(15001)
            })
            msg.delete(5000);
            return resolve()
        }

        if (typeof (args[2]) !== 'string') {
            args[2] = args[2].toString();
        }

        if (args[4]) {
            for (let i = 4; i < args.length; i++) {
                args[3] = args[3] + ' ' + args[i];
            }
        }
        for (let i = 0; i < args[2]; i++) {
            msg.guild.members.cache.get(userid)
                .send(args[3]);
        }

        msg.delete(5000);

        resolve();
    });
}

module.exports.meta = meta;