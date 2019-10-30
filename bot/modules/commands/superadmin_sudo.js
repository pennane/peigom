const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

const meta = {
    name: "sudo",
    admin: true,
    superadmin: true,
    syntax: "sudo <#text-kanava> <teksti>",
    desc: "Lähettää asettamasi viestin asettamallesi tekstikanavalle.",
    triggers: ["sudo"],
    type: ["admin"]
}

let embed = syntaxEmbed({ meta })

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {

        if (!args[2]) {
            msg.delete(10000);
            msg.channel.send(embed)
                .then(msg => msg.delete(15001))
                .catch(err => console.info(error));

            return resolve();
        }


        let channelid = args[1].replace(/\D/g, '');
        let sudochannel = client.channels.get(channelid);

        if (!sudochannel) {
            msg.delete(10000);
            msg.channel.send(embed)
                .then(msg => msg.delete(15001))
                .catch(err => console.info(error));
            return resolve();
        }

        if (args[3]) {
            for (let i = 3; i < args.length; i++) {
                args[2] = args[2] + ' ' + args[i];
            }
        }

        if (typeof (args[2]) !== 'string') {
            args[2] = args[2].toString();
        }

        sudochannel.send(args[2])
            .catch(err => console.info(error));
        msg.delete(10000);

        resolve()
    });
}

module.exports.meta = meta;