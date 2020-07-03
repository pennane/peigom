const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

const configuration = {
    name: "sudo",
    admin: true,
    superadmin: true,
    syntax: "sudo <#text-kanava> <teksti>",
    desc: "Lähettää asettamasi viestin asettamallesi tekstikanavalle.",
    triggers: ["sudo"],
    type: ["admin"]
}

let embed = syntaxEmbed({ configuration })

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {

        if (!args[2]) {
            msg.delete({ timeout: 10000 })
            msg.channel.send(embed)
                .then(msg => msg.delete({ timeout: 15000 }))
                .catch(err => console.info(error));

            return resolve();
        }


        let channelid = args[1].replace(/\D/g, '');
        let sudochannel = client.channels.cache.get(channelid);

        if (!sudochannel) {
            msg.delete({ timeout: 10000 })
            msg.channel.send(embed)
                .then(msg => msg.delete({ timeout: 15000 }))
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
        msg.delete({ timeout: 10000 })

        resolve()
    });
}

module.exports.configuration = configuration;