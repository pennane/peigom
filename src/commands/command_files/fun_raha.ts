import * as AppConfiguration from '../../lib/config'
import fs from 'fs'
import Discord from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

if (!fs.existsSync('./data/raha/user-data.json')) {
  fs.writeFileSync('./data/raha/user-data.json', '[]')
}

interface UserData {
  credits: number
  id: string
  whenClaimed: number
  username: string
}

type NewUserObject = Omit<UserData, 'whenClaimed' | 'credits'>

let userData: UserData[] = JSON.parse(
  fs.readFileSync('./data/raha/user-data.json', 'utf8')
)

const rahaConfiguration = {
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
  }
}

const configuration: CommandConfiguration = {
  name: 'raha',
  admin: false,
  syntax: 'raha <saldo / uhkapeli / lahjoita /  palkka>',
  desc: 'Kosmeettisen virtuaalivaluutan pyörittelyyn',
  triggers: ['raha', 'rahe', 'money', 'gamble'],
  type: ['fun']
}

const { PREFIX } = AppConfiguration

function createUserObject({ id, username }: NewUserObject) {
  return {
    credits: 200,
    id: id,
    whenClaimed: Date.now() - 86400000,
    username: username
  }
}
function handleWin(
  message: Discord.Message,
  original: Discord.Message,
  userObject: UserData | undefined,
  gambleAmount: number,
  credits: number
) {
  if (!userObject) return
  const embed = new Discord.MessageEmbed()
    .setColor(0xf4e542)
    .setTitle(
      `Käyttäjä ${original.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`
    )
    .setDescription(
      `:game_die: Voitto! Sait ${gambleAmount} kolikkoa :game_die:`
    )
  message.edit({ embeds: [embed] }).catch((error) => console.info(error))
  userObject.credits = credits + gambleAmount
}

function handleLose(
  message: Discord.Message,
  original: Discord.Message,
  userObject: UserData | undefined,
  gambleAmount: number,
  credits: number,
  lostAmount: number
) {
  if (!userObject) return
  const embed = new Discord.MessageEmbed()
    .setColor(0xf4e542)
    .setTitle(
      `Käyttäjä ${original.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`
    )
    .setDescription(
      `:game_die: Häviö! Hävisit ${lostAmount} kolikkoa :game_die:`
    )
  message.edit({ embeds: [embed] }).catch((error) => console.info(error))
  userObject.credits = credits - gambleAmount
}

function didWin() {
  const result = Math.round(Math.random())
  return result === 1
}

const executor: CommandExecutor = async (message, client, args) => {
  if (message.author.bot) return

  const syntax = configuration.syntax
  const daily = rahaConfiguration.daily

  function syntaxInfo() {
    const embed = new Discord.MessageEmbed().setColor(0xf4e542)
    embed
      .setTitle(`Komento ${configuration.name} toimii näin:`)
      .setDescription(`\`${PREFIX}${syntax}\``)
    return embed
  }

  const updateData = (userObject: UserData) => {
    userData = userData.map((user) =>
      user.id == userObject.id ? userObject : user
    )

    fs.writeFile(
      './data/raha/user-data.json',
      JSON.stringify(userData),
      function (err) {
        if (err) {
          return console.info(err)
        }
      }
    )
  }

  const userId = message.author.id
  let userObject = userData.find((user) => user.id === userId)

  if (!userObject) {
    const newUserObject = createUserObject({
      id: message.author.id,
      username: message.author.username
    })
    userData.push(newUserObject)
    userObject = userData.find((user) => user.id === userId)
  }

  if (!userObject) throw new Error('failed to crate new user object')

  if (!userObject.username || userObject.username !== message.author.username) {
    userObject.username = message.author.username
  }

  if (!args[1]) {
    message.channel.send({ embeds: [syntaxInfo()] })
    updateData(userObject)
    return
  }

  const command = args[1].toLowerCase()

  switch (command) {
    case 'saldo': {
      const targetId = args[2] ? args[2].replace(/\D/g, '') : undefined
      const target = targetId
        ? userData.find((user) => user.id === targetId)
        : userObject

      if (!target) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
          .setDescription(`Antamasi ukkeli ei ole uhkapelannut.`)
        message.channel
          .send({ embeds: [embed] })
          .catch((error) => console.info(error))
        return
      }

      const embed = new Discord.MessageEmbed().setColor(0xf4e542)
      embed
        .setTitle(`${target.username} balanssi:`)
        .setDescription(`${target.credits} kolea`)
      message.channel
        .send({ embeds: [embed] })
        .catch((error) => console.info(error))
      return
    }
    case 'uhkapeli': {
      const credits = Number(userObject.credits)

      const gambleAmount = parseInt(args[2])

      if (!gambleAmount || gambleAmount <= 0) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
          .setDescription(`Asettamasi rahasumma on olematon tai ylihärö`)
        message.channel.send({ embeds: [embed] })
        return
      }

      if (gambleAmount > credits) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
          .setDescription(`Olet köyhimys. Rahasi eivät riitä.`)
        message.channel.send({ embeds: [embed] })
        return
      }

      const startMessage = new Discord.MessageEmbed()
        .setColor(0xf4e542)
        .setTitle(
          `Käyttäjä ${message.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`
        )
        .setDescription(`:game_die:`)

      message.channel.send({ embeds: [startMessage] }).then((sentMessage) => {
        const won = didWin()
        setTimeout(() => {
          if (!userObject) return

          if (won) {
            handleWin(sentMessage, message, userObject, gambleAmount, credits)
          } else {
            handleLose(
              sentMessage,
              message,
              userObject,
              gambleAmount,
              credits,
              args[2]
            )
          }
          updateData(userObject)
        }, 1600)
      })
      return
    }
    case 'lahjoita': {
      if (!args[3]) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
          .setDescription(`${PREFIX}raha lahjoita <@käyttäjä> <määrä>`)
        message.channel.send({ embeds: [embed] })
        return
      }

      const donationAmount = parseInt(args[3])

      if (!donationAmount || donationAmount <= 0) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
          .setDescription(`${PREFIX}raha lahjoita <@käyttäjä> <määrä>`)
        message.channel.send({ embeds: [embed] })
        return
      }

      const credits = Number(userObject.credits)

      if (donationAmount > credits) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
          .setDescription(
            `Olet köyhä. Köyhänä ei lahjoitella tuollaisia summia.`
          )
        message.channel.send({ embeds: [embed] })
        return
      }

      const receiverId = args[2].replace(/\D/g, '')

      const receiver = userData.find((user) => user.id === receiverId)

      if (!receiver) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xf4e542)
          .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
          .setDescription(
            `Lahjoituksesi vastaanottajaa ei kiinnosta rahat. Houkuttele hänet ensin uhkapelaamaan.`
          )
        message.channel.send({ embeds: [embed] })
        return
      }

      receiver.credits = receiver.credits + donationAmount
      userObject.credits = userObject.credits - donationAmount

      const embed = new Discord.MessageEmbed()
        .setColor(0xf4e542)
        .setTitle(`${message.author.username}, huomaa:`)
        .setDescription(
          `Lahjoitit ${parseInt(args[2])} kolikkoa onnistuneesti!`
        )
      message.channel
        .send({ embeds: [embed] })
        .catch((error) => console.info(error))

      updateData(userObject)
      updateData(receiver)

      return
    }
    case 'palkka': {
      const claimedInLast24h = Date.now() - userObject.whenClaimed < 86400000

      if (claimedInLast24h) {
        const embed = new Discord.MessageEmbed().setColor(0xf4e542)
        const timeremaining = Math.round(
          (((userObject.whenClaimed + 86400000 - Date.now()) / 1000 / 60 / 60) *
            100) /
            100
        )
        embed
          .setTitle(`${message.author.username}, huomaa:`)
          .setDescription(`Vielä ${timeremaining} tuntia et saat kolikkeleita.`)
        message.channel
          .send({ embeds: [embed] })
          .catch((error) => console.info(error))

        updateData(userObject)
        return
      }

      const embed = new Discord.MessageEmbed()
        .setColor(0xf4e542)
        .setTitle(`${message.author.username}, huomaa:`)
        .setDescription(`Sait päivän palkan, eli ${daily} kolikkelia.`)

      message.channel
        .send({ embeds: [embed] })
        .catch((error) => console.info(error))
      userObject.whenClaimed = Date.now()
      userObject.credits = userObject.credits + daily

      updateData(userObject)
      return
    }

    default:
      message.channel
        .send({ embeds: [syntaxInfo()] })
        .catch((error) => console.info(error))
      return
  }
}

export default new Command({
  configuration,
  executor
})
