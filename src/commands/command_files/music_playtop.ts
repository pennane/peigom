import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import { queueMethods, Track } from '../../sound_handling/sound'
import { getYoutubeVideo } from '../../lib/util'

const configuration: CommandConfiguration = {
  name: 'playtop',
  admin: false,
  syntax: 'play <hakusanat / linkki>',
  desc: 'soita musiikkia youtubesta ja viskoo sen jonon ekaksi',
  triggers: ['playtop', 'pt'],
  type: ['music'],
  requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
  const voiceChannel = message.member?.voice.channel
  const guild = message.guild

  if (!message.member || !guild) return

  if (!voiceChannel)
    return message.reply('Mene ensin jollekin puhekanavalle, kid.')

  if (voiceChannel.type === 'GUILD_STAGE_VOICE') return

  if (!args[1]) {
    const embed = Command.syntaxEmbed({
      configuration,
      heading: ':point_up: Missä hakusanat'
    })
    message.channel.send({ embeds: [embed] })
    return
  }

  const query = args.slice(1).join(' ')
  message.channel.send(`:mag: Etitään \`${query}\``)

  let track: Track
  try {
    const fetchedTrack = await getYoutubeVideo(query)
    track = fetchedTrack
  } catch {
    return message.reply(
      ':baby: Youtube salee ratelimittaa. Chillaile pyyntöjen kans.'
    )
  }

  if (!track) {
    return message.reply(':baby: Bro keissi keissi, ei toimi bro')
  }

  track.requestedBy = message.member
  track.toTop = true

  queueMethods.add({
    track: track,
    voiceChannel: voiceChannel,
    guild: guild,
    message: message
  })

  return
}

export default new Command({
  configuration,
  executor
})
