const config = require('config')
const loader = require('./commandLoader')
const { check } = require('../utilities/spamProtection')

let badWords = require('../../assets/misc/badwords/badwords.json').badwords
let commandDir = __dirname + '/../commands'
let prefix = config.get("discord.prefix")
let spamProtection = config.get("misc.spamprotection")
let { commands, triggers } = loader.loadCommands(commandDir);

module.exports.parseMsg = function (msg, client) {
    let bad = badWords.some(word => msg.content.includes(word))
    let hasPrefix = msg.content.startsWith(prefix)

    if (!hasPrefix && bad) {
        msg.react(client.emojis.get("304687480471289866"))
        .catch(err => { logger.log(3, err) })
    }
    if (!hasPrefix) return;

    let args = msg.content.trim().substr(prefix.length).split(' ')
    let trigger = args[0].toLowerCase()

    if (!triggers.hasOwnProperty(trigger)) return;

    let command = commands[triggers[trigger]]
    if (!spamProtection.enabled) {
        command.exec(msg, client, args)
    } else {
        check(msg.member.user, command)
            .then((data) => {
                if (data.allowed) {
                    command.exec(msg, client, args)
                } else {
                    msg.reply(`Rauhoitu komentojen kanssa, venaa ${data.wait} sekuntia.`)
                }
            })
            .catch(err => { logger.log(3, err) })
    }
}