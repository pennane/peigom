const config = require('config');
const CommandExecutor = require('../core/command-executor.js');

var info = {
    name: "auta",
    admin: false,
    syntax: "auta <komennon nimi>",
    desc: "Kertoo tietoa"
}

module.exports = exports = {};

exports.run = function (msg, client, args) {
    var cfile = CommandExecutor.files();
    var cmdMsg = '';
    var acmdMsg = '';
    var msgtosend = '';
    if (!args[1]) {
        for (i in cfile.coms) {
            var obj = cfile.coms[i];
            if (obj.info.admin) {
                acmdMsg += '\n' + config.discord.prefix + obj.info.name;
            } else {
                cmdMsg += '\n' + config.discord.prefix + obj.info.name;
            }
            msgtosend = `Komentojen prefix on: ${config.discord.prefix}\nKaikki komennot o: \`\`\`${cmdMsg}\`\`\`\nKaikki admin komennot o: \`\`\`${acmdMsg} \`\`\`\nLisätietoa tietystä komennosta:\n\`\`\`${config.discord.prefix}auta <komennon nimi>\`\`\``;
        }
    } else {
        if (cfile.coms[args[1]]) {
            msgtosend = `Komento toimii näin:\`\`\`${cfile.coms[args[1]].info.syntax}\`\`\`Komennon toiminto:\`\`\`${cfile.coms[args[1]].info.desc}\`\`\``;
        } else {
            msgtosend = `Antamaasi komentoa \`${args[1]}\` ei ole olemassa.`
        }
    }
    msg.channel.send(msgtosend)
        .catch(error => console.log(error));
}

exports.info = info;