const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

const meta = {
    name: "sudopm",
    admin: true,
    superadmin: true,
    syntax: "sudopm <@käyttäjä> <teksti>",
    desc: "Lähettää asettamasi viestin asettamallesi pelaajalle.",
    triggers: ["sudopm"],
    type: ["admin"]
}

let embed = syntaxEmbed({ meta })

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (!args[2]) {
            msg.delete(1200);
            msg.channel.send(embed)
                .then(msg => {
                    msg.delete(15001)
                })
                .catch(err => console.info(err));
            return resolve()
        }

        let userid = args[1].replace(/\D/g, '');
        let sudouser = msg.guild.members.cache.get(userid);

        if (!sudouser) {
            msg.delete(1200);
            msg.channel.send(embed)
                .then(msg => {
                    msg.delete(15001)
                })
                .catch(err => console.info(err));
            return resolve()
        }

        if (args[3]) {
            for (let i = 3; i < args.length; i++) {
                args[2] = args[2] + ' ' + args[i];
            }
        }
        if (typeof (args[2]) !== 'string') {
            args[2] = args[2].toString();
        }
        sudouser.send(args[2]);

        msg.delete(1200);
        resolve();
    });
}

module.exports.meta = meta;