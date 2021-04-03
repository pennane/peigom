import names from '../../assets/badwords/badwords.json'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import { Role } from 'discord.js'
import { randomFromArray } from '../../lib/util'

const configuration: CommandConfiguration = {
    name: 'vittuile',
    admin: false,
    syntax: 'vittuile',
    desc: 'Vittuile botille',
    triggers: ['vittuile'],
    type: ['fun']
}

const executor: CommandExecutor = async (message, client, args) => {
    if (!message.member || !client?.user) {
        return
    }

    message.channel.send(
        `**${message.author.username} ${
            message.member.nickname ? `a.k.a ${message.member.nickname}` : ''
        }**, ai rupeet vittuilee hä?`
    )

    if (message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply('Oops, sori oot vissii joku admin kid.').catch((err) => console.info(err))
    }

    let clientMember = message.guild?.members.cache.get(client.user.id)

    if (!clientMember || !clientMember.hasPermission('MANAGE_NICKNAMES')) {
        message.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
        return
    }

    let clientHierarchy = clientMember.roles.cache.reduce((a: number, c: Role) => (c.position > a ? c.position : a), 0)

    if (message.member.roles.cache.some((role) => role.position > clientHierarchy)) {
        message.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
        return
    }

    let nickName = randomFromArray(names)

    await message.member.setNickname(nickName)
    message.reply(`Miltäs uusi kaunis nimesi '${nickName}' tuntuu, hä?`)
}

export default new Command({
    configuration,
    executor
})
