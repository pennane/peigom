const chalk = require('chalk')
const fs = require('fs')
const schedule = require('node-schedule')

const config = require('./config')
const time = require('./getTime')
const logger = require('./activityLogger')
const zimmerTj = require('./zimmerTJ')

const badwords = require('../assets/misc/badwords/badwords.json')
let { commands } = require('../core/commandLoader').loaded()
let { ACTIVITIES, REFRESH_RATE } = config.DISCORD.PRESENCE

let userData = fs.existsSync('./assets/misc/raha/user-data.json')
  ? JSON.parse(fs.readFileSync('./assets/misc/raha/user-data.json', 'utf8'))
  : undefined

const shuffleArray = (arr) => {
  let a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const s = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[s]] = [a[s], a[i]]
  }
  return a
}

module.exports.init = () => {
  const { client } = require('../index')

  let activities = shuffleArray(ACTIVITIES)
  let i = Math.floor(Math.random() * activities.length)

  client.user.setActivity(activities[i].text, { type: activities[i].type })

  zimmerTj(client)

  schedule.scheduleJob(`*/${REFRESH_RATE} * * * *`, () => {
    client.user.setActivity(activities[i].text, { type: activities[i].type })
    if (i === activities.length - 1) i = 0
    else i++
  })

  console.info(chalk.yellow('Logged in as ') + chalk.bgYellow.black(' ' + client.user.tag + ' '))
  console.info(chalk.yellow('| Time: ') + time.get(1))
  if (!client.timing.completed) {
    console.info(chalk.yellow('| Connecting ') + (new Date() - client.timing.timer) + ' ms')
    client.timing.completed = true
  }
  console.info(chalk.yellow('| Loaded: ') + commands.size + ' commands')
  console.info(chalk.yellow('| Loaded: ') + client.guilds.cache.size + ' servers')
  console.info(chalk.yellow('| Loaded: ') + (userData ? userData.length : 0) + ' users with ' + config.PREFIX + 'raha')
  console.info(chalk.yellow('| Loaded: ') + badwords.length + ' forbidden words')
  console.info(
    chalk.yellow('| Log user used commands: ') + (config.LOG_USED_COMMANDS ? chalk.green('true') : chalk.red('false'))
  )
  console.info(
    chalk.yellow('| Command spam protection: ') +
      (config.COMMAND_SPAM_PROTECTION.STATE ? chalk.green('true') : chalk.red('false'))
  )

  logger.log(2)
}
