const fs = require('fs');
const logger = require('../functions/activity-logger.js');
const spamCheck = require('../functions/spam-protection.js');
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

module.exports.commands = coms

module.exports.files = function () {
        return {
            coms: coms,
            files: filearr
        }
}
module.exports.execute =({ msg, command, args, unauthorized }, client) => {
        return new Promise( async (resolve) => {
            
            if (await unauthorized.isIt) {
                msg.reply(`Sinulla ei ole oikeutta käyttää komentoa ${unauthorized.command}`)
                return resolve()
            }

            if (await !coms.hasOwnProperty(command)) return resolve();

            let spam = await spamCheck.check(msg.member.user, command)

            if (!spam.allowed && config.misc.commandspamprotection) {
                msg.reply(`Rauhoitu komentojen kanssa, venaa ${spam.waittime} sekuntia.`)
                return resolve()
            } else {
                try {
                    await coms[command].run(msg, client, args)
                    logger.log(1, { msg: msg, command: command, args: args })
                } catch (err) {
                    console.log(err);
                    logger.log(6, { msg: msg, command: command, args: args })
                } finally {
                    return resolve()
                }

            }
        });
    }
