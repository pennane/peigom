const Discord = require('discord.js')

let embed = new Discord.MessageEmbed().setColor(0xf4e542).setTitle('Botin kommentti:').setDescription('example')

const configuration = {
  name: 'example',
  admin: false,
  syntax: 'example <amount> <@who>',
  desc: 'description for ,example',
  triggers: ['example']
}

module.exports = {
  executor: (msg, client, args) => {
    return new Promise((resolve, reject) => {
      /*
          COMMAND LOGIC HERE
          MOVE COMPLETED FILE TO ./src/commands/
          */
      resolve()
    })
  },
  configuration
}
