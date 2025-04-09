import { ChannelType } from 'discord.js'
import dancemoves from '../../assets/fortnite/dancemoves'
import playSound from '../../sound_handling/playSound'
import Command, { CommandExecutor } from '../Command'

const configuration = {
  name: 'fortnite',
  admin: false,
  syntax: 'fortnite',
  desc: 'tanssi eeppisiä fornite liikkeitä',
  triggers: ['fortnite', 'fortnight', 'fornite'],
  type: ['fun', 'sound']
}

const soundfile = './assets/sound/fortnite.mp3'

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  if (!message.member || !message.guild) return

  const voiceChannel = message.member?.voice.channel

  const user = message.member.user

  if (!voiceChannel) {
    const embed = Command.createEmbed()
    embed
      .setTitle(`Botin kommentti:`)
      .setDescription(
        `${user.username} mene eka jollekki voicechannelille, kid.`
      )
    channel.send({ embeds: [embed] })
    return
  }

  playSound({ soundfile, message, exitAfter: true })
  dancemoves.forEach((move, i) => {
    setTimeout(() => {
      channel.send(move)
    }, (7000 * i) / dancemoves.length + 500)
  })
}

export default new Command({
  configuration,
  executor
})
