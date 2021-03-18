const sound = require('../utilities/playSound.js')
const Discord = require('discord.js')

let embed = new Discord.MessageEmbed().setColor(0xf4e542)

const configuration = {
    name: 'kassa',
    admin: false,
    syntax: 'kassa',
    desc: 'Soittaa kassa äänen',
    triggers: ['kassa'],
    type: ['sound']
}

let soundfile = './assets/sound/kassa.mp3'

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        sound.play({ soundfile, msg, client, args })

        resolve()
    })
}

module.exports.configuration = configuration
