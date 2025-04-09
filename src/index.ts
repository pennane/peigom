import chalk from 'chalk'
import { Client, GatewayIntentBits } from 'discord.js'
import fs from 'fs'
import activityLogger from './lib/activityLogger'
import * as AppConfiguration from './lib/config'
import infoUpdater from './lib/infoUpdater'
import messageHandler from './message_handling/handler'

import { CommandConfiguration } from './commands/Command'
import commadData from './commands/loader'

const createCommandMap = async () => {
  const { commands } = await commadData()
  const commandMetaMap: CommandConfiguration[] = []
  commands.forEach((command) => {
    commandMetaMap.push(command._configuration)
  })

  fs.writeFileSync(
    __dirname + '/../commandMetaMap.json',
    JSON.stringify(commandMetaMap)
  )
}

createCommandMap()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildVoiceStates
  ]
})
const timing = { timer: new Date(), completed: false }

console.info(chalk.yellow(`Starting peigom-bot`))

client.on('ready', () => {
  activityLogger.log({ id: 0 })
  infoUpdater.init({ client, timing })
})

client.on('messageCreate', async (message) => {
  if (message.author.bot || message.guild === null) return
  messageHandler.parse(message, client)
})

client.on('guildCreate', (guild) =>
  activityLogger.log({ id: 20, content: `${guild.name} ${guild.id}` })
)
client.on('guildDelete', (guild) =>
  activityLogger.log({ id: 21, content: `${guild.name} ${guild.id}` })
)
client.on('resume', () => activityLogger.log({ id: 1 }))
client.on('error', (error) => activityLogger.log({ id: 32, error }))

process.on('uncaughtException', (error) =>
  activityLogger.log({ id: 31, error })
)

if (process.env.NODE_ENV === 'development') {
  client.on('rateLimit', (reason) =>
    console.info('Client being ratelimited:', reason)
  )
}

client.login(AppConfiguration.DISCORD_TOKEN)
