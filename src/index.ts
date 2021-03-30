process.chdir(__dirname)

import * as AppConfiguration from './util/config'
import Discord from 'discord.js'
import chalk from 'chalk'
import messageHandler from './message_handling/handler'
import infoUpdater from './util/infoUpdater'

const client = new Discord.Client()

const timing = { timer: new Date(), completed: false }

console.info(chalk.yellow(`Starting peigom-bot`))

client.on('ready', () => {
    infoUpdater.init({ client, timing })
})

client.on('message', async (message) => {
    if (message.author.bot || message.guild === null) return
    messageHandler.parse(message, client)
})

client.on('rateLimit', (reason) => console.info('Client being ratelimited:', reason))

client.login(AppConfiguration.DISCORD_TOKEN)
