const _ = require("underscore");
const config = require("config")

module.exports.parse = function (msg) {
    return new Promise((resolve, reject) => {

        if (!_.isObject(msg)) { throw new Error("Invalid arguments") }
        if (_.has(msg, 'prefix')) {
            let prefix = config.discord.prefix;

            if (msg.content.startsWith(prefix)) {
                msg.prefix = prefix;
                msg.trimmed = msg.content.substr(prefix.length);
            }

            if (!_.has(msg, 'prefix')) {
                throw new Error("Cannot resolve prefix");
            }
        }

        if (!_.has(msg, 'command')) {
            msg.command = msg.trimmed.split(' ')[0];
            msg.arguments = msg.trimmed
                .trim()
                .split(/ +/g);
        }
        if (_.contains(config.get('discord.authorized'), msg.author.id ) || msg.member.roles.find(role => role.name === config.discord.authorizedRole[0])) {
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