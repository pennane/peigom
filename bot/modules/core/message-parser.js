const _ = require("underscore");

var exports = module.exports = {};

exports.parse = function (client, msg) {
    return new Promise((resolve, reject) => {
        
        if (!_.isObject(client) || !_.isObject(msg)) { throw new Error("Invalid arguments"); }
        if (_.has(msg, 'prefix')) {
            var prefix = client.config.discord.prefix;

            if (msg.content.startsWith(prefix)) {
                msg.prefix = prefix;
                msg.trimmed = msg.content.substr(prefix.length);
            }

            if (!_.has(msg, 'prefix')) { throw new Error("Cannot resolve prefix"); }
        }

        if (!_.has(msg, 'command')) {
            msg.command = msg.trimmed.split(' ')[0];
            msg.arguments =  msg.trimmed
            .trim()
            .split(/ +/g);
        }

        if (_.contains(client.config.get('discord.authorized'), msg.author.id)) {
            msg.authorized = true;
        } else {
            msg.authorized = false;
        }


        resolve({client: client, msg: msg, prefix: msg.prefix, command: msg.command, arguments: msg.arguments})
    });

}