import fs from 'fs'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

if (!fs.existsSync('./data/adminUsers/data.json')) {
  fs.writeFileSync('./data/adminUsers/data.json', '{}')
}

const configuration: CommandConfiguration = {
  name: 'piilota',
  admin: false,
  syntax: 'piilota',
  desc: 'Antaa admin oikeudet jollee roolille',
  triggers: ['shuflle', 'shufle', 'toanotheruniversenwordukkeli'],
  type: ['other'],
  hidden: true
}

const executor: CommandExecutor = async (message, client, args) => {
  if (!message.guild?.available) return

  if (
    !message.guild.channels.cache.find(
      (channel) => channel.id === '478914376569585665'
    )
  )
    return

  if (!message.member?.voice.channel) return

  message.member.voice.setChannel('478914376569585665')
}

export default new Command({
  configuration,
  executor
})
