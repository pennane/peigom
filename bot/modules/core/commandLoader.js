const fs = require('fs')
const Command = require('./command')
const logger = require('../utilities/activityLogger')
const youtubeApiKey = require('../../config/authorize.json')['youtube-api-key']
const commandDirectory = __dirname + '/../commands'

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

let loadedTriggers = new Map()
let loadedCommands = new Map()

function loadCommand(target) {

    if (!target) throw new Error('Did not receive a target to load the command from')

    let { file, directory } = target;

    if (!file || !directory) throw new Error('Missing arguments')

    if (!file.endsWith('.js')) throw new Error('Received file was not a javascript file')

    let command = new Command(require(commandDirectory + "/" + file), file)

    if (!command) throw new Error('Failed to load the command. Check given arguments.')

    let triggers = [];

    try {

        // If youtube api key is unavailable, do not load music commands
        if (!youtubeApiKey && command.type.some(type => type === "music")) {
            return;
        }

        command.triggers.forEach((trigger) => {
            if (reservedNames.indexOf(trigger) !== -1) {
                throw new Error(`Warning! Command '${command.name}' tried to use a reserved name '${trigger}' as a trigger.`)
            }

            loadedTriggers.forEach((triggers, command) => {
                if (triggers.indexOf(trigger) !== -1) {
                    throw new Error(`Warning! Command '${command.name}' interferes with command '${command}' with the trigger '${trigger}'`)
                }
            })

            triggers.push(trigger)
        })

        loadedCommands.set(command.name, command)
        loadedTriggers.set(command.name, triggers)
    } catch (err) {
        logger.log(13, { file, err, stack: err.stack })
    }
}

function unloadCommand(commandName) {
    if (loadedCommands.has(commandName)) {
        loadedCommands.delete(commandName)
        loadedTriggers.delete(commandName)
    }
}

fs.readdirSync(commandDirectory).forEach(file => {
    if (file.endsWith(".js")) {
        loadCommand({
            file: file,
            directory: commandDirectory
        })
    }
})

module.exports.loaded = () => {

    let _triggers = {}

    loadedTriggers.forEach((triggers, command) => {
        triggers.forEach((trigger) => {
            _triggers[trigger] = command;
        })
    })

    return { commands: loadedCommands, triggers: _triggers }
}
