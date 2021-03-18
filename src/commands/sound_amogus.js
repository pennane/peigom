const sound = require('../utilities/playSound.js')
const Discord = require('discord.js')

let embed = new Discord.MessageEmbed().setColor(0xf4e542)

const configuration = {
    name: 'amogus',
    admin: false,
    syntax: 'amogus',
    desc: 'Soittaa amogus äänen',
    triggers: ['amogus'],
    type: ['sound']
}

let soundfile = './assets/sound/amogus.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve()
    })
}

module.exports.configuration = configuration
