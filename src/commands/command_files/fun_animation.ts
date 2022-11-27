import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import { PREFIX } from '../../lib/config'

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
    keyframes: [
      'Yo, Big Shaq, the one and only',
      "Man's not hot, never hot",
      'Skrrat, skidi-kat-kat',
      'Boom'
    ]
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
  const embed = Command.createEmbed()

  if (Object.keys(animations).length === 0) {
    embed
      .setTitle(`Hupsista saatana`)
      .setDescription(`Botilla ei ole yhtäkään animaatiota ladattuna.`)
    message.channel.send({ embeds: [embed] })
    return
  }

  const animationNames = animations.map((animation) =>
    animation.name.toLowerCase()
  )

  if (!args[1]) {
    embed
      .setTitle(`Lista saatavailla olevista animaatioista:`)
      .setDescription(`\`${animationNames}\``)
      .setFooter(
        'Käyttöesimerkki: ' +
          PREFIX +
          configuration.name +
          ' ' +
          animationNames[0]
      )
    await message.channel.send({ embeds: [embed] })
    return
  }

  const animationName = args[1].toLowerCase()
  const animation = animations.find(
    (animation) => animation.name.toLowerCase() === animationName.toLowerCase()
  )

  if (!animation) {
    embed
      .setTitle(`Lista saatavailla olevista animaatioista:`)
      .setDescription(`\`${animationNames}\``)
      .setFooter(
        'Käyttöesimerkki: ' +
          PREFIX +
          configuration.name +
          ' ' +
          animationNames[0]
      )
    await message.channel.send({ embeds: [embed] })
    return
  }

  const animationMessage = await message.channel.send(animation.keyframes[0])

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
