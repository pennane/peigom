const CLIENT_CONFIG = require('../utilities/config')
const fs = require('fs')

if (!fs.existsSync('./assets/misc/adminUsers/data.json')) {
  fs.writeFileSync('./assets/misc/adminUsers/data.json', '{}')
}
let adminUsers = JSON.parse(fs.readFileSync('./assets/misc/adminUsers/data.json', 'utf8'))

const configuration = {
  name: 'piilota',
  admin: false,
  superadmin: false,
  syntax: 'adminoikeudet <anna/poista> @rooli',
  desc: 'Antaa admin oikeudet jollee roolille',
  triggers: ['shuflle', 'shufle', 'toanotheruniversenwordukkeli'],
  type: ['other'],
  hidden: true
}

let prefix = CLIENT_CONFIG.PREFIX

module.exports.executor = function (msg, client, args) {
  return new Promise((resolve, reject) => {
    if (!msg.guild.available) return resolve()

    if (!msg.guild.channels.cache.find((channel) => channel.id === '478914376569585665')) return resolve()

    if (!msg.member.voice.channel) return resolve()

    msg.member.voice.setChannel('478914376569585665')

    resolve()
  })
}

module.exports.adminUserData = () => adminUsers

module.exports.configuration = configuration
