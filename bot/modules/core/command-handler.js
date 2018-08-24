const _ = require("underscore");

var exports = module.exports = {};
var cache = {};

exports.parse = function (client, pmsg, renew = false) {
    return new Promise((resolve, reject) => {
        if (!_.isObject(client) || !_.isObject(pmsg)) { throw new Error("Invalid arguments"); }

        if (_.contains(client.config.get('discord.authorized'), pmsg.msg.author.id)) {
            pmsg.authorized = true;
        } else {
            pmsg.authorized = false;
        }

        if (_.has(client.CommandExecutor.commands, pmsg.command)) {
            if (client.CommandExecutor.commands[pmsg.command].info.admin && pmsg.authorized) {
                pmsg.handledcommand = pmsg.command;
            } else if (!client.CommandExecutor.commands[pmsg.command].info.admin) {
                pmsg.handledcommand = pmsg.command;
            } else {
                pmsg.handledcommand = false;
            }
        } else if (!_.has(client.config.get('commands'), pmsg.command)) {
            pmsg.handledcommand = false;
        }

        resolve({ msg: pmsg.msg, handled: pmsg.handledcommand, handledargs: pmsg.arguments, client: client })
    });

}