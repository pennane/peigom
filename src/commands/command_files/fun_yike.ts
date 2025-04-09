import { getVoiceConnection } from '@discordjs/voice'
import { ChannelType } from 'discord.js'
import playSound from '../../sound_handling/playSound'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'yike',
  admin: false,
  syntax: 'yike <@user>',
  desc: 'award yikes',
  triggers: ['yike', 'yikes', '+yike'],
  type: ['fun', 'sound']
}

const soundfile = './assets/misc/yike/yike.mp3'

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  if (!message.guild) return

  const targetUser = args[1]
    ? message.guild.members.cache.get(args[1].replace(/\D/g, ''))
    : false
  if (!targetUser) {
    const embed = Command.createEmbed()
    embed
      .setTitle(`Botin kommentti:`)
      .setDescription(
        `${message.author.username} ei tollasille voi antaa yikejä. (yike <@user>)`
      )
    channel.send({ embeds: [embed] })
    return
  }

  const voiceChannel = targetUser.voice.channel

  const botVoiceConnection = getVoiceConnection(message.guild.id)

  if (!voiceChannel || botVoiceConnection) {
    channel.send({
      content: targetUser.toString(),
      files: [
        {
          attachment: './assets/misc/yike/yike.jpg',
          name: 'yike.jpg'
        }
      ]
    })
    return
  }

  playSound({ soundfile, message, exitAfter: true })
  channel.send({
    content: targetUser.toString(),
    files: [
      {
        attachment: './assets/misc/yike/yike.jpg',
        name: 'yike.jpg'
      }
    ]
  })
}

export default new Command({
  configuration,
  executor
})
