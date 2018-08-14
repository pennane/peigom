const _ = require("underscore");

var exports = module.exports = {};
var cache = {};

exports.parse = function (client, msg, renew = false) {
    return new Promise((resolve, reject) => {
        
        if (!_.isObject(client) || !_.isObject(msg)) { throw new Error("Invalid arguments"); }
        if (_.has(msg, 'prefix')) {
            var prefix = client.config.get('discord.prefix');

            if (msg.content.startsWith(prefix)) {
                msg.prefix = prefix;
                msg.trimmed = msg.content.substr(prefix.length);
            }

            if (!_.has(msg, 'prefix')) { throw new Error("Cannot resolve prefix"); }
        }
        if (!_.has(msg, 'trimmed')) { throw new Error("Missing trimmed argument when prefix is present"); }

        if (!_.has(msg, 'command')) {
            msg.command = msg.trimmed.split(' ')[0];
            msg.arguments =  msg.trimmed
            .trim()
            .split(/ +/g);
        }


        resolve({cached: false, client: client, msg: msg, prefix: msg.prefix, command: msg.command, arguments: msg.arguments})
    });

}