const fs = require('fs')
const Command = require('./command')

module.exports.loadCommands = function (path) {
    let files = []
    let triggers = {}
    let commands = {}

    fs.readdirSync(path).forEach(file => {
        if (file.endsWith(".js")) {
            files.push(file);
        }
    })

    files.forEach(file => {
        let command;
        command = new Command(require(path + "/" + file))
        try {
            command.triggers.forEach((trigger) => {
                if (triggers.hasOwnProperty(trigger)) {
                    throw new Error(`Warning! Command ${command.name} interfering with ${triggers.trigger} with trigger ${trigger}`)
                } else {
                    triggers[trigger] = command.name
                }
            })
            commands[command.name] = command;
        } catch (err) {
            console.log("Command " + command.name + " failed to load.")
        }

    })
    return {
        commands,
        triggers
    }
}