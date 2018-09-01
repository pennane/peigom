const _ = require('underscore');
const fs = require('fs');
const logger = require('../functions/activity-logger.js');
const spam = require('../functions/spam-protection.js');

var exports = module.exports = {}, coms = {}, filearr = [];

fs.readdirSync("./modules/commands/").forEach(file => {
    if (file.endsWith(".js")) {
        filearr.push(file);
    }
});

for (file in filearr) {
    var filenm = filearr[file].slice(0, -3);
    coms[filenm] = require(`../commands/${filearr[file]}`);
}

exports.commands = coms;

exports.files = function () {
    return { coms: coms, files: filearr }
};

exports.parse = function (msg, client, command, args) {
    return new Promise((resolve, reject) => {
        if (_.has(coms, command)) {
            let allowed = true;
            spam.check(client, msg.member.user, command)
                .then(parsed => {
                    if (!parsed.allowed && client.config.misc.commandspamprotection) {
                        msg.reply(`Rauhoitu komentojen kanssa, venaa ${parsed.waittime} sekuntia.`)
                            .catch(error => console.log(error));
                        return resolve();
                    } else {
                        coms[command].run(msg, client, args)
                            .then(() => {
                                logger.log(1, { msg: msg, command: command, args: args })
                                    .catch(error => console.log(error));
                            })
                            .catch(error => {
                                console.log(error);
                                logger.log(6, { msg: msg, command: command, args: args })
                                    .catch(error => console.log(error));
                            });
                    }
                })
                .catch(error => console.log(error));





        }
        resolve();
    });

}