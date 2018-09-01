const _ = require("underscore");

var exports = module.exports = {};
var cache = {};

exports.parse = function (client, parsed) {
    return new Promise((resolve, reject) => {
        if (!_.isObject(client) || !_.isObject(parsed)) { throw new Error("Invalid arguments"); }

        if (_.has(client.CommandExecutor.commands, parsed.command)) {
            if (client.CommandExecutor.commands[parsed.command].info.admin && parsed.msg.authorized) {
                parsed.handledcommand = parsed.command;
            } else if (!client.CommandExecutor.commands[parsed.command].info.admin) {
                parsed.handledcommand = parsed.command;
            } else {
                parsed.handledcommand = false;
            }
        } 
        
        resolve({ msg: parsed.msg, command: parsed.handledcommand, args: parsed.arguments, client: client })
    });

}