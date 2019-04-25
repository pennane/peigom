process.chdir(__dirname)

const authorize = require('./config/authorize.json')
const config = require('config')
const Discord = require('discord.js')
const loader = require('./modules/core/commandLoader')
const parser = require('./modules/core/messageParser')
const client = new Discord.Client()

let badWords = config.get('misc.badwords')
let prefix = config.get("discord.prefix")
let commandDir = __dirname + '/modules/newCommands'


loader.loadCommands(commandDir).then(({ commands, triggers }) => {
    client.on('message', msg => {
        if (msg.author.bot || msg.guild === null) return;

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
    })
})

client.login(authorize.token)