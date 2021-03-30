import fs from 'fs'
import path from 'path'
import Command from './Command.js'

const commandDirectoryName = './command_files'
const directory = fs.readdirSync(path.resolve(__dirname, commandDirectoryName))

import activityLogger from '../util/activityLogger'

const reservedNames = ['työkalut', 'komennot', 'hauskat', 'kuvat', 'admin', 'muut']

let loadedTriggers: Map<string, Array<string>> = new Map()
let loadedCommands: Map<string, Command> = new Map()

interface CommandTarget {
    file: string
    directory: string
}

const loadCommand = async (target: CommandTarget) => {
    let { file, directory } = target

    let importedCommand
    try {
        importedCommand = await import(`${directory}/${file}`)
    } catch (error) {
        activityLogger.log({ id: 11, content: 'Failed to load command ' + file, error })
    }

    const command: Command = importedCommand.default

    if (!command) throw new Error(`Failed to load command from ${directory}/${file}`)
    let triggers: Array<string> = []

    try {
        command.triggers.forEach((trigger) => {
            if (reservedNames.indexOf(trigger) !== -1) {
                throw new Error(
                    `Warning! Command '${command.name}' tried to use a reserved name '${trigger}' as a trigger.`
                )
            }

            loadedTriggers.forEach((_triggers, _command) => {
                if (_triggers.indexOf(trigger) !== -1) {
                    throw new Error(
                        `Warning! Command '${command.name}' interferes with command '${_command}' with the trigger '${trigger}'`
                    )
                }
            })

            triggers.push(trigger)
        })

        loadedCommands.set(command.name, command)
        loadedTriggers.set(command.name, triggers)
    } catch (error) {
        activityLogger.log({ id: 11, content: 'Conflicting triggers ' + file, error })
    }
}

let commandPromises: Array<Promise<any>> = []

directory.forEach((file: string) => {
    if (!file.endsWith('.ts') && !file.endsWith('.js')) return
    try {
        commandPromises.push(
            loadCommand({
                file: file,
                directory: commandDirectoryName
            })
        )
    } catch (error) {
        activityLogger.log({ id: 11, content: 'Failed to push load promise to commandPromises ' + file, error })
    }
})

const getLoadedCommands = async () => {
    await Promise.allSettled(commandPromises)
    let _triggers: any = {}
    loadedTriggers.forEach((triggers, command) => {
        triggers.forEach((trigger: string) => {
            _triggers[trigger] = command
        })
    })
    return { commands: loadedCommands, triggers: _triggers }
}

export default getLoadedCommands
