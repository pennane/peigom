const config = require('config')
const loader = require('./commandLoader')
const { check } = require('../utilities/spamProtection')
const logger = require('../utilities/activityLogger')

const badWords = require('../../assets/misc/badwords/badwords.json').badwords
const disabledChannels = require('../commands/admin_disable').channelData;

let commandDir = __dirname + '/../commands'
let prefix = config.get("discord.prefix")
let COMMAND_SPAM_PROTECTION = config.get("COMMAND_SPAM_PROTECTION")
let { commands, triggers } = loader.load(commandDir);

module.exports.parseMsg = function (msg, client) {
    let hasBadWords = badWords.some(word => msg.content.includes(word))
    let hasPrefix = msg.content.startsWith(prefix)

    if (!hasPrefix && hasBadWords) {
        msg.react(client.emojis.get("304687480471289866"))
            .catch(err => { logger.log(3, err) })
    }

    let disabled = disabledChannels()
    let channelId = msg.channel.id

    if (!hasPrefix) return;

    let args = msg.content.trim().substr(prefix.length).split(' ')

    let trigger = args[0].toLowerCase()

    if (!triggers.hasOwnProperty(trigger)) return;

    let command = commands[triggers[trigger]]

    if (disabled.hasOwnProperty(channelId) && disabled[channelId] === "disabled" && command.name !== "bottitoimiitäällä") {
        msg.channel.send("Botti ei toimi tällä tekstikanavalla.").then((msg) => { msg.delete(10000) }).catch(console.error)
        return;
    };

    if (!COMMAND_SPAM_PROTECTION.STATE) {
        command.exec(msg, client, args)
    } else {
        check(msg.member.user, command)
            .then(({ allowed, remaining }) => {
                if (allowed) {
                    command.exec(msg, client, args)
                } else {
                    msg.reply(`Rauhoitu komentojen kanssa, venaa ${parseInt(remaining / 1000)} sekuntia.`)
                }
            })
            .catch(err => { logger.log(3, err) })
    }
}