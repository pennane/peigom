import { ChannelType, PermissionFlagsBits, Role } from 'discord.js'
import names from '../../assets/badwords/badwords.json'
import { randomFromArray } from '../../lib/util'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'vittuile',
  admin: false,
  syntax: 'vittuile',
  desc: 'Vittuile botille',
  triggers: ['vittuile'],
  type: ['fun']
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  if (!message.member || !client?.user) {
    return
  }

  channel.send(
    `**${message.author.username} ${
      message.member.nickname ? `a.k.a ${message.member.nickname}` : ''
    }**, ai rupeet vittuilee hä?`
  )

  if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return message
      .reply('Oops, sori oot vissii joku admin kid.')
      .catch((err) => console.info(err))
  }

  const clientMember = message.guild?.members.cache.get(client.user.id)

  if (
    !clientMember ||
    !clientMember.permissions.has(PermissionFlagsBits.ManageNicknames)
  ) {
    message.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
    return
  }

  const clientHierarchy = clientMember.roles.cache.reduce(
    (a: number, c: Role) => (c.position > a ? c.position : a),
    0
  )

  if (
    message.member.roles.cache.some((role) => role.position > clientHierarchy)
  ) {
    message.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
    return
  }

  const nickName = randomFromArray(names)

  await message.member.setNickname(nickName)
  message.reply(`Miltäs uusi kaunis nimesi '${nickName}' tuntuu, hä?`)
}

export default new Command({
  configuration,
  executor
})
