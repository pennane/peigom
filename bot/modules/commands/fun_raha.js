const CLIENT_CONFIG = require('../utilities/config')

const fs = require('fs')

const Discord = require('discord.js')

if (!fs.existsSync('./assets/misc/raha/user-data.json')) {
  fs.writeFileSync('./assets/misc/raha/user-data.json', '[]')
}

let userData = JSON.parse(fs.readFileSync('./assets/misc/raha/user-data.json', 'utf8'))

const configuration = {
  name: 'raha',
  admin: false,
  syntax: 'raha <saldo / uhkapeli / lahjoita /  palkka>',
  desc: 'Kosmeettisen virtuaalivaluutan pyörittelyyn',
  daily: 250,
  sub: {
    saldo: {
      syntax: 'raha saldo ?<@pelaaja>',
      desc: 'Näyttää oman tai toisen rahatilanteen.',
      name: 'saldo'
    },
    uhkapeli: {
      syntax: 'raha uhkapeli <määrä>',
      desc: 'Heittää asettamallasi määrällä kolikkoa. Voitolla tuplaat panoksen, ja häviöllä menetät.',
      name: 'uhkapeli'
    },
    lahjoita: {
      syntax: 'raha lahjoita <@kenelle> <määrä>',
      desc: 'Lahjoittaa asettamasi määrän haluamallesi käyttäjälle.',
      name: 'lahjoita'
    },
    palkka: {
      syntax: 'raha palkka',
      desc: 'Antaa sinulle päivän palkan.',
      name: 'palkka'
    }
  },
  triggers: ['raha', 'rahe', 'money', 'gamble'],
  type: ['fun']
}

module.exports.executor = function (msg, client, args) {
  return new Promise((resolve, reject) => {
    if (msg.author.bot) return

    let prefix = CLIENT_CONFIG.PREFIX

    const syntax = configuration.syntax
    const daily = configuration.daily

    function syntaxInfo() {
      let embed = new Discord.MessageEmbed().setColor(0xf4e542)
      embed.setTitle(`Komento ${configuration.name} toimii näin:`).setDescription(`\`${syntax}\``)
      return embed
    }

    const updateData = (userObject) => {
      userData = userData.map((user) => (user.id !== userObject.id ? user : userObject))
    }

    function close() {
      let userData = fs.writeFile('./assets/misc/raha/user-data.json', JSON.stringify(userData), function (err) {
        if (err) {
          return console.info(err)
        }
      })
    }

    function createUserObject({ id, username }) {
      return {
        credits: 200,
        id: id,
        whenClaimed: Date.now() - 86400000,
        username: username
      }
    }

    let userId = msg.author.id
    let userObject = userData.find((user) => user.id === userId)

    if (!userObject.username || userObject.username !== msg.author.username) {
      userObject.username = msg.author.username
    }

    if (!userObject) {
      let newUserObject = createUserObject({ id: msg.author.id, username: username })
      userData.push(newUserObject)
      userObject = userData.find((user) => user.id === userId)
    }

    if (!args[1]) {
      msg.channel.send(syntaxInfo())
      updateData(userObject)
      return close()
    }

    let command = args[1].toLowerCase()

    switch (command) {
      case 'saldo': {
        let embed = new Discord.MessageEmbed().setColor(0xf4e542)
        let targetId = args[2] ? args[2].replace(/\D/g, '') : undefined
        let target = targetId ? userData.find((user) => user.id === targetId) : userObject

        embed.setTitle(`${target.username} balanssi:`).setDescription(`${target.credits} kolea`)
        msg.channel.send(embed).catch((error) => console.info(error))
        return close()
      }
      case 'uhkapeli': {
        function didWin() {
          let result = Math.round(Math.random())
          return result === 1
        }

        let credits = parseInt(userObject.credits)
        let gambleAmount = parseInt(args[2])

        function handleWin(message) {
          let embed = new Discord.MessageEmbed()
            .setColor(0xf4e542)
            .setTitle(`Käyttäjä ${msg.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`)
            .setDescription(`:game_die: Voitto! Sait ${gambleAmount} kolikkoa :game_die:`)
          message.edit(embed).catch((error) => console.info(error))
          userObject.credits = credits + gambleAmount
        }

        function handleLose(message) {
          let embed = new Discord.MessageEmbed()
            .setColor(0xf4e542)
            .setTitle(`Käyttäjä ${msg.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`)
            .setDescription(`:game_die: Häviö! Hävisit ${args[2]} kolikkoa :game_die:`)
          message.edit(embed).catch((error) => console.info(error))
          userObject.credits = credits - gambleAmount
        }

        if (!gambleAmount || gambleAmount <= 0) {
          return close()
        }

        if (gambleAmount > credits) {
          return close()
          // user does not have enaf mani
        }

        let startMessage = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${msg.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`)
          .setDescription(`:game_die:`)

        msg.channel.send(startMessage).then((sentMessage) => {
          let won = didWin()
          setTimeout(() => {
            if (won) {
              handleWin(sentMessage)
            } else {
              handleLose(sentMessage)
            }
            updateData(userObject)
            close()
          }, 1600)
        })
        return
      }
      case 'lahjoita': {
        if (!args[3]) {
          return close()
        }

        let donationAmount = parseInt(args[3])

        if (!donationAmount || donationAmount <= 0) {
          return close()
        }

        let credits = parseInt(userObject.credits)

        if (donationAmount > credits) {
          return close()
        }

        let receiverId = args[2].replace(/\D/g, '')

        let receiver = userData.find((user) => user.id === receiverId)

        if (!receiver) {
          return close()
        }

        receiver.credits = receiver.credits + donationAmount
        userObject.credits = userObject.credits - donationAmount

        let embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`${msg.member.user.username}, huomaa:`)
          .setDescription(`Lahjoitit ${parseInt(args[2])} kolikkoa onnistuneesti!`)
        msg.channel.send(embed).catch((error) => console.info(error))

        updateData(userObject)
        updateData(receiver)

        return close()
      }
      case 'palkka': {
        if (Date.now() - userObject.whenClaimed < 86400000) {
          let embed = new Discord.MessageEmbed().setColor(0xf4e542)
          let timeremaining = Math.round(
            (((userObject.whenClaimed + 86400000 - Date.now()) / 1000 / 60 / 60) * 100) / 100
          )
          embed
            .setTitle(`${msg.member.user.username}, huomaa:`)
            .setDescription(`Vielä ${timeremaining} tuntia et saat kolikkeleita.`)
          msg.channel.send(embed).catch((error) => console.info(error))
          return close()
        }

        let embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`${msg.member.user.username}, huomaa:`)
          .setDescription(`Sait päivän palkan, eli ${daily} kolikkelia.`)

        msg.channel.send(embed).catch((error) => console.info(error))
        userObject.whenClaimed = Date.now()
        userObject.credits = userObject.credits + daily

        updateData(userObject)

        return close()
      }

      default:
        msg.channel.send(syntaxInfo()).catch((error) => console.info(error))
        return close()
    }
  })
}

module.exports.configuration = configuration
