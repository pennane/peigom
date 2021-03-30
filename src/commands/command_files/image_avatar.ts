import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'avatar',
    admin: false,
    syntax: 'avatar {@kuka}',
    desc: 'Esittää oman, tai muun avatarin',
    triggers: ['avatar'],
    type: ['image']
}

const executor: CommandExecutor = async (message, client, args) => {
    let embed = Command.createEmbed()
    if (args.length === 1) {
        let user = message.author
        let image = user.displayAvatarURL({
            format: 'png',
            dynamic: true,
            size: 4096
        })

        embed.setTitle(`Käyttäjän ${user.username} avatari.`).setImage(image)
        message.channel.send(embed)
        return
    }

    if (!args[1].startsWith('<@')) {
        return message.reply(`Et käyttänyt \`@käyttäjä\` syntaksia.`)
    }

    if (!message.guild) return

    let mention = message.mentions.members ? message.mentions.members.first() : null

    if (!mention) {
        return message.reply(`Käyttäjä jonka tägäsit on rikki.`)
    }

    let member = message.guild.member(mention)

    if (!member) {
        return message.reply(`${args[1]} ei ole tällä severillä`)
    }

    let image = member.user.displayAvatarURL({
        format: 'png',
        dynamic: true,
        size: 4096
    })

    embed.setTitle(`Käyttäjän ${member.displayName} avatari.`)
    embed.setImage(image)

    message.channel.send(embed)
    return
}

export default new Command({
    configuration,
    executor
})
