const fs = require('fs')
const Command = require('./command')
const logger = require('../utilities/activityLogger')

const reservedNames = [
    "utility",
    "komennot",
    "fun",
    "sound",
    "music",
    "image",
    "admin",
    "other"
]

module.exports.load = function (path) {
    let files = []
    let triggers = {}
    let commands = {}

    fs.readdirSync(path).forEach(file => {
        if (file.endsWith(".js")) {
            files.push(file);
        }
    })

    files.forEach((file) => {

        let command = new Command(require(path + "/" + file), file)

        try {
            command.triggers.forEach((trigger) => {
                if (reservedNames.indexOf(trigger) !== -1) {
                    throw new Error(`Warning! Command "${command.name}" tried to use a reserved name ${trigger} as a trigger.`)
                } else if (triggers.hasOwnProperty(trigger)) {
                    throw new Error(`Warning! Command "${command.name}" interfering with "${triggers[trigger]}" with trigger "${trigger}"`)
                } else {
                    triggers[trigger] = command.name
                }
            })
            commands[command.name] = command;
        } catch (err) {
            logger.log(13, { file, err, stack: err.stack })
        }

    })
    return { commands, triggers }
}