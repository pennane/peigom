import * as AppConfiguration from '../../util/config'
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

let userData: UserData[] = JSON.parse(fs.readFileSync('./data/raha/user-data.json', 'utf8'))

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

const executor: CommandExecutor = async (message, client, args) => {
    if (message.author.bot) return

    const syntax = configuration.syntax
    const daily = rahaConfiguration.daily

    function syntaxInfo() {
        let embed = new Discord.MessageEmbed().setColor(0xf4e542)
        embed.setTitle(`Komento ${configuration.name} toimii näin:`).setDescription(`\`${syntax}\``)
        return embed
    }

    const updateData = (userObject: UserData) => {
        userData = userData.map((user) => (user.id == userObject.id ? userObject : user))

        fs.writeFile('./data/raha/user-data.json', JSON.stringify(userData), function (err) {
            if (err) {
                return console.info(err)
            }
        })
    }

    function createUserObject({ id, username }: NewUserObject) {
        return {
            credits: 200,
            id: id,
            whenClaimed: Date.now() - 86400000,
            username: username
        }
    }

    let userId = message.author.id
    let userObject = userData.find((user) => user.id === userId)

    if (!userObject) {
        let newUserObject = createUserObject({ id: message.author.id, username: message.author.username })
        userData.push(newUserObject)
        userObject = userData.find((user) => user.id === userId)
    }

    if (!userObject) throw new Error('failed to crate new user object')

    if (!userObject.username || userObject.username !== message.author.username) {
        userObject.username = message.author.username
    }

    if (!args[1]) {
        message.channel.send(syntaxInfo())
        updateData(userObject)
        return
    }

    let command = args[1].toLowerCase()

    switch (command) {
        case 'saldo': {
            let targetId = args[2] ? args[2].replace(/\D/g, '') : undefined
            let target = targetId ? userData.find((user) => user.id === targetId) : userObject

            if (!target) {
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
                    .setDescription(`Antamasi ukkeli ei ole uhkapelannut.`)
                message.channel.send(embed).catch((error) => console.info(error))
                return
            }

            let embed = new Discord.MessageEmbed().setColor(0xf4e542)
            embed.setTitle(`${target.username} balanssi:`).setDescription(`${target.credits} kolea`)
            message.channel.send(embed).catch((error) => console.info(error))
            return
        }
        case 'uhkapeli': {
            function didWin() {
                let result = Math.round(Math.random())
                return result === 1
            }

            let credits = Number(userObject.credits)

            let gambleAmount = parseInt(args[2])

            function handleWin(message: Discord.Message) {
                if (!userObject) return
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`)
                    .setDescription(`:game_die: Voitto! Sait ${gambleAmount} kolikkoa :game_die:`)
                message.edit(embed).catch((error) => console.info(error))
                userObject.credits = credits + gambleAmount
            }

            function handleLose(message: Discord.Message) {
                if (!userObject) return
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`)
                    .setDescription(`:game_die: Häviö! Hävisit ${args[2]} kolikkoa :game_die:`)
                message.edit(embed).catch((error) => console.info(error))
                userObject.credits = credits - gambleAmount
            }

            if (!gambleAmount || gambleAmount <= 0) {
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
                    .setDescription(`Asettamasi rahasumma on olematon tai ylihärö`)
                message.channel.send(embed)
                return
            }

            if (gambleAmount > credits) {
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
                    .setDescription(`Olet köyhimys. Rahasi eivät riitä.`)
                message.channel.send(embed)
                return
            }

            let startMessage = new Discord.MessageEmbed()
                .setColor(0xf4e542)
                .setTitle(`Käyttäjä ${message.author.username} uhkapelaa ${gambleAmount} kolikolla. Lets mennään.`)
                .setDescription(`:game_die:`)

            message.channel.send(startMessage).then((sentMessage) => {
                let won = didWin()
                setTimeout(() => {
                    if (!userObject) return

                    if (won) {
                        handleWin(sentMessage)
                    } else {
                        handleLose(sentMessage)
                    }
                    updateData(userObject)
                }, 1600)
            })
            return
        }
        case 'lahjoita': {
            if (!args[3]) {
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
                    .setDescription(`${PREFIX}raha lahjoita <@käyttäjä> <määrä>`)
                message.channel.send(embed)
                return
            }

            let donationAmount = parseInt(args[3])

            if (!donationAmount || donationAmount <= 0) {
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
                    .setDescription(`${PREFIX}raha lahjoita <@käyttäjä> <määrä>`)
                message.channel.send(embed)
                return
            }

            let credits = Number(userObject.credits)

            if (donationAmount > credits) {
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
                    .setDescription(`Olet köyhä. Köyhänä ei lahjoitella tuollaisia summia.`)
                message.channel.send(embed)
                return
            }

            let receiverId = args[2].replace(/\D/g, '')

            let receiver = userData.find((user) => user.id === receiverId)

            if (!receiver) {
                let embed = new Discord.MessageEmbed()
                    .setColor(0xf4e542)
                    .setTitle(`Käyttäjä ${message.author.username}, huomaa:`)
                    .setDescription(
                        `Lahjoituksesi vastaanottajaa ei kiinnosta rahat. Houkuttele hänet ensin uhkapelaamaan.`
                    )
                message.channel.send(embed)
                return
            }

            receiver.credits = receiver.credits + donationAmount
            userObject.credits = userObject.credits - donationAmount

            let embed = new Discord.MessageEmbed()
                .setColor(0xf4e542)
                .setTitle(`${message.author.username}, huomaa:`)
                .setDescription(`Lahjoitit ${parseInt(args[2])} kolikkoa onnistuneesti!`)
            message.channel.send(embed).catch((error) => console.info(error))

            updateData(userObject)
            updateData(receiver)

            return
        }
        case 'palkka': {
            let claimedInLast24h = Date.now() - userObject.whenClaimed < 86400000

            if (claimedInLast24h) {
                let embed = new Discord.MessageEmbed().setColor(0xf4e542)
                let timeremaining = Math.round(
                    (((userObject.whenClaimed + 86400000 - Date.now()) / 1000 / 60 / 60) * 100) / 100
                )
                embed
                    .setTitle(`${message.author.username}, huomaa:`)
                    .setDescription(`Vielä ${timeremaining} tuntia et saat kolikkeleita.`)
                message.channel.send(embed).catch((error) => console.info(error))

                updateData(userObject)
                return
            }

            let embed = new Discord.MessageEmbed()
                .setColor(0xf4e542)
                .setTitle(`${message.author.username}, huomaa:`)
                .setDescription(`Sait päivän palkan, eli ${daily} kolikkelia.`)

            message.channel.send(embed).catch((error) => console.info(error))
            userObject.whenClaimed = Date.now()
            userObject.credits = userObject.credits + daily

            updateData(userObject)
            return
        }

        default:
            message.channel.send(syntaxInfo()).catch((error) => console.info(error))
            return
    }
}

export default new Command({
    configuration,
    executor
})
