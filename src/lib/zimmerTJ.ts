import Discord from 'discord.js'
import schedule from 'node-schedule'

const zimmerChannelId = '759808413877796966'
const zimmerDate = new Date(`May 13, 2023 01:00:00`).getTime()

function calculateTimeDifference(d: number, ad: number) {
  const dateDistance = Math.abs(d - ad)
  const daysBetween = Math.floor(dateDistance / (1000 * 60 * 60 * 24))
  const hoursBetween = Math.floor(
    (dateDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  return { days: daysBetween, hours: hoursBetween }
}

function editZimmerChannel(channel: Discord.VoiceChannel) {
  if (!channel) return console.info('zimmer channel not available')
  const remaining = calculateTimeDifference(zimmerDate, Date.now())
  if (!remaining.days) return console.info('could not resolve tj')
  if (!channel.manageable) return console.info('zimmer channel not editable')

  const oldTJ = parseInt(channel.name.replace('€viisu tj: ', ''))

  if (remaining.days == oldTJ) return

  channel.edit({
    name: '€viisu tj: ' + remaining.days
  })
}

const HandleZimmer = async (client: Discord.Client) => {
  const channel = (await client.channels.fetch(
    zimmerChannelId
  )) as Discord.VoiceChannel
  editZimmerChannel(channel)
  schedule.scheduleJob('* */2 * * *', function () {
    editZimmerChannel(channel)
  })
}

export default HandleZimmer
