import Discord from 'discord.js'
import schedule from 'node-schedule'
import { ceiledDayDifference } from './util'

const zimmerChannelId = '759808413877796966'
const zimmerDate = new Date(`May 11, 2024 00:00:00`).getTime()

export function editZimmerChannel(channel: Discord.VoiceChannel) {
  if (!channel) return console.info('zimmer channel not available')
  const daysRemaining = ceiledDayDifference(zimmerDate, Date.now())
  if (!daysRemaining) return console.info('could not resolve tj')
  if (!channel.manageable) return console.info('zimmer channel not editable')

  const oldTJ = parseInt(channel.name.replace('€viisu tj: ', ''))

  if (daysRemaining == oldTJ) return

  channel.edit({
    name: '€viisu tj: ' + daysRemaining
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
