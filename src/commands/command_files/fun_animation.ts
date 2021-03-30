import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import { PREFIX } from '../../util/config'

const animations = [
    {
        name: 'smile',
        desc: 'makes you thonk',
        delay: 600,
        keyframes: [
            ':thinking::black_circle::black_circle::black_circle::black_circle:',
            ':black_circle::thinking::black_circle::black_circle::black_circle:',
            ':black_circle::black_circle::thinking::black_circle::black_circle:',
            ':black_circle::black_circle::black_circle::thinking::black_circle:',
            ':thinking::thinking::thinking::thinking::thinking:'
        ]
    },
    {
        name: 'shaq',
        desc: 'Animation of bigshaqud',
        delay: 2100,
        keyframes: ['Yo, Big Shaq, the one and only', "Man's not hot, never hot", 'Skrrat, skidi-kat-kat', 'Boom']
    }
]

const configuration: CommandConfiguration = {
    name: 'animation',
    admin: false,
    syntax: 'animation <nimi tai lista>',
    desc: 'Toistaa käyttäjän antaman animaation',
    triggers: ['animation'],
    type: ['fun']
}

const executor: CommandExecutor = async (message, client, args) => {
    let embed = Command.createEmbed()

    if (Object.keys(animations).length === 0) {
        embed.setTitle(`Hupsista saatana`).setDescription(`Botilla ei ole yhtäkään animaatiota ladattuna.`)
        message.channel.send(embed)
        return
    }

    let animationName = args[1].toLowerCase()

    let animationNames = animations.map((animation) => animation.name.toLowerCase())

    let animation = animations.find((animation) => animation.name.toLowerCase() === animationName.toLowerCase())

    if (!animation) {
        embed
            .setTitle(`Lista saatavailla olevista animaatioista:`)
            .setDescription(`\`${animationNames}\``)
            .setFooter('Esim: ' + PREFIX + configuration.name + ' ' + animationNames[0])
        message.channel.send(embed)
        return
    }

    let animationMessage = await message.channel.send(animation.keyframes[0])

    animation.keyframes.slice(1).forEach((frame, i) => {
        if (!animation) return
        setTimeout(() => {
            if (!animation) return
            animationMessage.edit(frame), animation.delay
        }, animation.delay * (1 + i))
    })
}

export default new Command({
    configuration,
    executor
})
