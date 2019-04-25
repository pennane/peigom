const { client } = require('../../index')
const config = require('config')
const loader = require('./commandLoader')
let badWords = require('../../assets/misc/badwords/badwords.json')

let commandDir = __dirname+'/../newCommands'

let prefix = config.get("discord.prefix")

let {commands, triggers} = loader.loadCommands(commandDir);

module.exports.parseMsg = function(msg) {
        let bad = badWords.some(word => msg.content.includes(word))
        let hasPrefix = msg.content.startsWith(prefix)
    
        if (!hasPrefix && bad) { msg.react(client.emojis.get("304687480471289866")) }
        if (!hasPrefix) return;
    
        let args = msg.content.trim().substr(prefix.length).split(' ')
    
        let trigger = args[0]
    
        if (triggers.hasOwnProperty(trigger)) {
            let command = commands[triggers[trigger]]
            command.exec(msg, client, args)
        }
}