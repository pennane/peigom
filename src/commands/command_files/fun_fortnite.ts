import playSound from '../../sound_handling/playSound'
import dancemoves from '../../assets/fortnite/dancemoves'
import Command, { CommandExecutor } from '../Command'
import { queueMethods } from '../../sound_handling/sound'

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
    message.channel.send({ embeds: [embed] })
    return
  }

  playSound({ soundfile, message, exitAfter: true })
  dancemoves.forEach((move, i) => {
    setTimeout(() => {
      message.channel.send(move)
    }, (7000 * i) / dancemoves.length + 500)
  })
}

export default new Command({
  configuration,
  executor
})
