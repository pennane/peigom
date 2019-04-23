const config = require("config")

module.exports.parse = function (msg) {
    return new Promise((resolve, reject) => {

        if (typeof msg === 'object' && msg !== null) { throw new Error("Invalid arguments") }

        if (msg.hasOwnProperty('prefix')) {
            let prefix = config.discord.prefix;

            if (msg.content.startsWith(prefix)) {
                msg.prefix = prefix;
                msg.trimmed = msg.content.substr(prefix.length);
            }
        }

        if (!msg.hasOwnProperty('command')) {
            msg.command = msg.trimmed.split(' ')[0];
            msg.arguments = msg.trimmed
                .trim()
                .split(/ +/g);
        }

        if (config.get('discord.authorized').indexOf(msg.author.id) > -1 || msg.member.roles.find(role => role.name === config.discord.authorizedRole[0])) {
            msg.authorized = true;
        } else {
            msg.authorized = false;
        }


        resolve({
            msg: msg,
            prefix: msg.prefix,
            cmd: msg.command,
            args: msg.arguments
        })
    });

}