const fs = require('fs')
const chalk = require('chalk')
const config = require('./config')

const time = require('./getTime')

module.exports.log = (activityId, content) => {
  return new Promise((resolve, reject) => {
    if (!activityId === parseInt(activityId, 10)) throw new Error('Error: Received activity id is not an integer!')

    // If config has been set to not log used commands, return
    if (!config.LOG_USED_COMMANDS && activityId === 1) return

    let today = time.get(),
      todayPrecise = time.get(1),
      yyyy = time.yyyy(),
      mm = time.mm(),
      dd = time.dd(),
      hh = time.hh(),
      m = time.m(),
      ss = time.ss()

    let targetFile = `./log/${yyyy}/${mm}/${dd}.txt`

    if (!fs.existsSync(`./log/${yyyy}`)) fs.mkdirSync(`./log/${yyyy}`)
    if (!fs.existsSync(`./log/${yyyy}/${mm}`)) fs.mkdirSync(`./log/${yyyy}/${mm}`)
    if (!fs.existsSync(`./log/${yyyy}/${mm}/${dd}.txt`))
      fs.writeFileSync(`./log/${yyyy}/${mm}/${dd}.txt`, `Logs from ${dd}.${mm}.${yyyy}`)

    const saveActivityToFile = (message, targetFile) => {
      fs.appendFileSync(targetFile, message, (err) => {
        if (err) throw err
      })
    }

    /*
         Table for mode numbers:
             1: Discord Command; User used a commmand.
             2: Client Connected; Client connected succesfully.
             3: Client Error; Something happened at the websocket.
             4: Client Reconnecting; Client started to reconnect.
             5: Client Reconnected; Client reconnect succesfully.
             6: Discord Command Failure; Command failed.
             7: New member; a new member joined a server.
             8: Member left; member left from a server.
             9: New server; bot added to a new server.
             10: Server removed; bot removed from a server.
             11: Command load failure; command failed to initialize.
             12: Faulty command; command does not follow the command class.
             13: Command failure with stack; fail at command and stack exists.
             14: Command failed on use
             15: Discord Command; User tried to use an unauthorized commmand.
        */

    let activities = {
      1: {
        name: 'Used Discord Command',
        messageGenerator: (content) =>
          `\r\n[Command] ${hh}.${m}.${ss} [User: ${content.msg.author.username}:${content.msg.author.id}] [Command: ${
            content.command
          }] ${content.args[1] ? '[Args: ' + content.args.filter((arg, i) => i !== 0) + ']' : null} @${
            content.msg.channel.guild.name
          }:${content.msg.channel.guild.id}#${content.msg.channel.name}`
      },
      2: {
        name: 'Client Connected',
        messageGenerator: (content) => `\r\n[Connected @ ${todayPrecise}] `
      },
      3: {
        name: 'Client Error',
        messageGenerator: (content) =>
          `\r\n[Error @ ${todayPrecise}]\r\n${content}\r\n${
            content.stack ? content.stack : 'no error stack'
          }\n[ ---------- ]`,
        finally: (data) => {
          console.info(
            chalk.red(
              `|-- ${time.get(1)} > Error has happended in the ${chalk.yellow('client')}, check ${chalk.white(
                './log/'
              )}`
            )
          )
        }
      },
      4: {
        name: 'Client Reconnecting ',
        messageGenerator: (content) => `\r\n[Reconnecting @ ${todayPrecise}]`,
        finally: (data) => {
          console.info(chalk.orange(`|-- ${time.get(1)} > Reconnecting to websocket..`))
        }
      },
      5: {
        name: 'Client Reconnected',
        messageGenerator: (content) => `\r\n[Resumed @ ${todayPrecise}]`,
        finally: (data) => {
          console.info(chalk.green(`|-- ${time.get(1)} > Reconnected successfully`))
        }
      },
      6: {
        name: 'Discord Command Failure',
        messageGenerator: (content) =>
          `\r\n[Command Failed] User: ${content.msg.author.username}: ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`,
        finally: (data) => {}
      },
      7: {
        name: 'New Member on Guild',
        messageGenerator: (content) =>
          `\r\n[New member] User ${content.user.username}: ${content.id} Where: ${content.guild.name}:${content.guild.id} When: ${todayPrecise}`,
        finally: (data) => {
          console.info(
            chalk.gray(
              '|-- New member on ' +
                member.guild.name +
                ':' +
                member.guild.id +
                ', ' +
                member.user.username +
                ':' +
                member.user.id
            )
          )
        }
      },
      8: {
        name: 'Member Left from a Guild',
        messageGenerator: (content) =>
          `\r\n[Member left] User ${content.user.username}: ${content.id} Where: ${content.guild.name}:${content.guild.id} When: ${todayPrecise}`,
        finally: (data) => {}
      },
      9: {
        name: 'Client Added to a New Guild',
        messageGenerator: (content) => `\r\n[New server] Server: ${content.name}:${content.id} When: ${todayPrecise}`,
        finally: (data) => {
          console.info(
            chalk.gray(`|-- New guild joined: ${guild.name}:${guild.id}. This guild has ${guild.memberCount} members.`)
          )
        }
      },
      10: {
        name: 'Guild Removed from the Client',
        messageGenerator: (content) =>
          `\r\n[Removed server] Server: ${content.name}:${content.id} When: ${todayPrecise}`,
        finally: (data) => {
          console.info(chalk.gray(`|-- Bot removed from: ${guild.name}:${guild.id}`))
        }
      },
      11: {
        name: 'Command Failed to Load',
        messageGenerator: (content) => `\r\n[Failed command] Command '${content}' failed to load`,
        finally: (data) => {
          console.info(
            chalk.red(`|-- Command ${chalk.yellow(content)} failed to load. Check ${chalk.white('./log/')} for more`)
          )
        }
      },
      12: {
        name: 'Invalid Command',
        messageGenerator: (content) =>
          `\r\n[Invalid command] Failed command: ${content.name}. Reason: ${content.reason}`,
        finally: (data) => {
          console.info(
            chalk.red(
              `|-- Command ${chalk.yellow(content.name)} failed to construct itself. Check ${chalk.white(
                './log/'
              )} for more`
            )
          )
        }
      },
      13: {
        name: 'Command Failed to load with an Error Stack',
        messageGenerator: (content) =>
          `\r\n[Faulty command file] '${content.file}' failed to load. \r\n ${content.err}`,
        finally: (data) => {
          console.info(
            chalk.red(`|-- File ${chalk.yellow(content.file)} failed to load. Check ${chalk.white('./log/')} for more`)
          )
        }
      },
      14: {
        name: 'Command Failed on use',
        messageGenerator: (content) => `\r\n[Command failed on use] '${content.command}' \r\n ${content.description}`,
        finally: (data) => {}
      },
      15: {
        name: 'User Unauthorized for a Command',
        messageGenerator: (content) =>
          `\r\n[Unauthorized Command] User: ${content.msg.author.username}, ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}:${content.msg.channel.guild.id}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`,
        finally: (data) => {}
      }
    }

    let activityHandler = activities[activityId]

    if (activityHandler) {
      let message = activityHandler.messageGenerator(content)
      saveActivityToFile(message, targetFile)
      if (activityHandler.finally) {
        activityHandler.finally()
      }
    } else {
      throw new Error('Error: Received activity id does not exist.')
    }

    resolve()
  })
}
process.on('uncaughtException', (error) => {
  module.exports.log(3, error).catch((error) => console.info(error))
  console.info(chalk.red(`|-- ${time.get(1)} > Error has happended in the process, check ${chalk.white('./log/')}`))
})
