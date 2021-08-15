import { EventEmitter } from 'events'
import Discord from 'discord.js'
import * as AppConfiguration from '../lib/config'
import Command from '../commands/Command'
import loader from '../commands/loader'
import badWords from '../assets/badwords/badwords.json'
import { executor as SoundCommandExecutor } from '../commands/SoundCommand'

import { disabledChannels } from '../commands/command_files/admin_disable'
import { readSoundData } from '../commands/command_files/admin_createsound'

let triggers: { [trigger: string]: string }
let commands: Map<string, Command>

let commandsFetched: boolean = false

const fetchCommands = async () => {
    const loaded = await loader()
    commands = loaded.commands
    triggers = loaded.triggers
    commandsFetched = true
}

const prefix = AppConfiguration.PREFIX

export const SpecialMessages = new EventEmitter()

const handler = {
    parse: async (message: Discord.Message, client: Discord.Client): Promise<void> => {
        if (!commandsFetched) {
            await fetchCommands()
        }

        let customSounds = message.guild ? await readSoundData(message.guild) : null

        let hasBadWords = badWords.some((word) => message.content.includes(word))
        let hasPrefix = message.content.startsWith(prefix)

        if (!hasPrefix && hasBadWords) {
            const reactEmoji = client.emojis.cache.get('304687480471289866')
            if (!reactEmoji) return
            message.react(reactEmoji)
        }

        if (!hasPrefix && message.content.includes('bad bot')) {
            message.channel.send('no u')
            return
        }

        if (!hasPrefix && message.content.includes('good bot')) {
            message.channel.send('ty')
            return
        }

        if (!hasPrefix) return

        let args = message.content.trim().substr(prefix.length).split(' ')

        let trigger = args[0].toLowerCase()

        let customSoundCommand = customSounds ? customSounds[trigger] : null

        if (!triggers.hasOwnProperty(trigger) && !customSoundCommand) return

        let command = commands.get(triggers[trigger])
        let viableCommand = command && command.execute

        if (!viableCommand && !customSoundCommand) return

        let channelId = message.channel.id

        const ignoreCommand =
            command?.name !== 'bottitoimiitäällä' &&
            channelId in disabledChannels &&
            disabledChannels[channelId] === 'disabled'

        if (ignoreCommand) {
            let notifyMessage = await message.channel.send('Botti ei toimi tällä tekstikanavalla.')
            notifyMessage.delete({ timeout: 10000 })
            return
        }

        if (customSoundCommand) {
            SoundCommandExecutor(message, client, args, customSoundCommand)
        } else if (viableCommand) {
            ;(command as Command).execute(message, client, args)
        }

        return
    }
}

export default handler
