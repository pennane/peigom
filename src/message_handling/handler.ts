import Discord, { ChannelType } from 'discord.js'
import { EventEmitter } from 'events'
import badWords from '../assets/badwords/badwords.json'
import Command from '../commands/Command'
import loader from '../commands/loader'
import { executor as SoundCommandExecutor } from '../commands/SoundCommand'
import * as AppConfiguration from '../lib/config'

import { readSoundData } from '../commands/command_files/admin_createsound'
import { disabledChannels } from '../commands/command_files/admin_disable'

let triggers: { [trigger: string]: string }
let commands: Map<string, Command>

let commandsFetched = false

const fetchCommands = async () => {
  const loaded = await loader()
  commands = loaded.commands
  triggers = loaded.triggers
  commandsFetched = true
}

const prefix = AppConfiguration.PREFIX

export const SpecialMessages = new EventEmitter()

const handler = {
  parse: async (
    message: Discord.Message,
    client: Discord.Client
  ): Promise<void> => {
    if (!commandsFetched) {
      await fetchCommands()
    }

    const customSounds = message.guild
      ? await readSoundData(message.guild)
      : null

    const hasPrefix = message.content.startsWith(prefix)
    console.log(message.content)
    const channel = message.channel
    if (channel.type !== ChannelType.GuildText) return

    if (!hasPrefix) {
      const hasBadWords = badWords.some((word) =>
        message.content.includes(word)
      )
      if (hasBadWords) {
        const reactEmoji = client.emojis.cache.get('304687480471289866')
        if (!reactEmoji) return
        message.react(reactEmoji)
      }

      if (message.content.includes('bad bot')) {
        channel.send('no u')
        return
      }

      if (message.content.includes('good bot')) {
        channel.send('ty')
        return
      }

      return
    }

    const args = message.content.trim().substr(prefix.length).split(' ')

    const trigger = args[0].toLowerCase()

    const customSoundCommand = customSounds ? customSounds[trigger] : null

    if (
      !Object.prototype.hasOwnProperty.call(triggers, trigger) &&
      !customSoundCommand
    )
      return

    const command = commands.get(triggers[trigger])

    const channelId = message.channel.id

    const ignoreCommand =
      command?.name !== 'bottitoimiitäällä' &&
      channelId in disabledChannels &&
      disabledChannels[channelId] === 'disabled'

    if (ignoreCommand) {
      const notifyMessage = await channel.send(
        'Botti ei toimi tällä tekstikanavalla.'
      )
      setTimeout(() => notifyMessage.delete(), 10000)
      return
    }

    if (customSoundCommand) {
      SoundCommandExecutor(message, client, args, customSoundCommand)
    } else if (command) {
      command?.execute(message, client, args)
    }
  }
}

export default handler
