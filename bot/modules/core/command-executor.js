const _ = require('underscore');
const fs = require('fs');
const logger = require('../functions/activity-logger.js');
const spam = require('../functions/spam-protection.js');
const config = require('config')
let coms = {}
let filearr = [];

fs.readdirSync("./modules/commands/").forEach(file => {
    if (file.endsWith(".js")) {
        filearr.push(file);
    }
});

for (file in filearr) {
    let filenm = filearr[file].slice(0, -3);
    coms[filenm] = require(`../commands/${filearr[file]}`);
}

module.exports.commands = coms;

module.exports.files = () => {
    return {
        coms: coms,
        files: filearr
    }
};

module.exports.execute = ({msg, command, args, unauthorized}, client) => {
    return new Promise((resolve, reject) => {
        if (_.has(coms, command)) {
            let allowed = true;
            spam.check(msg.member.user, command)
                .then(parsed => {
                    if (!parsed.allowed && config.misc.commandspamprotection) {
                        msg.reply(`Rauhoitu komentojen kanssa, venaa ${parsed.waittime} sekuntia.`)
                            .catch(error => console.log(error));
                        return resolve();
                    } else {
                        coms[command].run(msg, client, args)
                            .then(() => {
                                logger.log(1, {
                                        msg: msg,
                                        command: command,
                                        args: args
                                    })
                                    .catch(error => console.log(error));
                            })
                            .catch(error => {
                                console.log(error);
                                logger.log(6, {
                                        msg: msg,
                                        command: command,
                                        args: args
                                    })
                                    .catch(error => console.log(error));
                            });
                    }
                })
                .catch(error => console.log(error));
        } else if (unauthorized.isIt) {
            msg.reply(`Sinulla ei ole oikeutta käyttää komentoa ${unauthorized.command}`)
        }
        resolve();
    });

}