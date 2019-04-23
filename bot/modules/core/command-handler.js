const CommandExecutor = require('./command-executor')

module.exports.handle = ({cmd, args, msg}) => {
    return new Promise((resolve, reject) => {
        let unauthorized = {};
        let command = false;
        if (CommandExecutor.commands.hasOwnProperty(cmd)) {
            if (CommandExecutor.commands[cmd].info.redirect && CommandExecutor.commands[CommandExecutor.commands[cmd].info.destination]) {
                cmd = CommandExecutor.commands[cmd].info.destination;
                args[0] = cmd
            }

            if (CommandExecutor.commands[cmd].info.admin && msg.authorized) {
                command = cmd;
            } else if (CommandExecutor.commands[cmd].info.admin && !msg.authorized) {
                unauthorized = {
                    isIt: true,
                    command: cmd
                };
            } else if (!CommandExecutor.commands[cmd].info.admin) {
                command = cmd;
            } 
        }

        resolve({
            msg: msg,
            command: command,
            args: args,
            unauthorized: unauthorized
        })
    });

}