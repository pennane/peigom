import { ChannelType } from 'discord.js'
import { splitMessage } from '../../lib/util'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'emojis',
  admin: false,
  superadmin: true,
  syntax: 'emojis',
  desc: 'Lähettää kanavalle kaikki botin tuntemat emojit',
  triggers: ['emojis', 'emojit'],
  type: ['utility', 'fun']
}

const executor: CommandExecutor = async (message, client, args) => {
  const emojis = client.emojis.cache
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  let emojiMessage = ''
  emojis.forEach((emoji) => {
    if (!emoji.available) return
    emojiMessage += `${emoji.toString()} `
  })
  const split = splitMessage(emojiMessage, { char: ' ' })
  split.forEach((content) => {
    channel.send(content)
  })
}

export default new Command({
  configuration,
  executor
})
