import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import { queueMethods, Track } from '../../sound_handling/sound'
import { getYoutubeVideo } from '../../lib/util'

const configuration: CommandConfiguration = {
  name: 'play',
  admin: false,
  syntax: 'play <hakusanat tai youtube-linkki>',
  desc: 'soita musiikkia youtubesta',
  triggers: ['play', 'p', 'soita'],
  type: ['music'],
  requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
  const voiceChannel = message.member?.voice.channel
  const guild = message.guild

  if (!message.member || !guild) return

  if (!voiceChannel)
    return message.reply('Mene ensin jollekin puhekanavalle, kid.')

  if (voiceChannel.type !== 'GUILD_VOICE') return

  if (!args[1]) {
    message.channel.send({
      embeds: [
        Command.syntaxEmbed({
          configuration,
          heading: ':point_up: Missä hakusanat'
        })
      ]
    })
    return
  }

  const query = args.slice(1).join(' ')

  message.channel.send(`:mag: Etitään \`${query}\``)
  console.log('trying to fetch with query', query)
  const test = setTimeout(() => console.log('should have aborted'), 11_000)
  let track: Track
  try {
    const fetchedTrack = await getYoutubeVideo(query)
    track = fetchedTrack
  } catch {
    return message.reply(
      ':baby: Youtube salee ratelimittaa. Chillaile pyyntöjen kans.'
    )
  } finally {
    clearTimeout(test)
  }
  console.log('block after')

  if (!track) {
    return message.reply(':baby: Bro keissi keissi, ei toimi bro')
  }

  track.requestedBy = message.member
  track.toTop = false

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
