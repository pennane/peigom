const names = require('../assets/misc/badwords/badwords.json')

const configuration = {
  name: 'vittuile',
  admin: false,
  syntax: 'vittuile',
  desc: 'Vittuile botille',
  triggers: ['vittuile'],
  type: ['fun']
}

module.exports.executor = function (msg, client, args) {
  return new Promise((resolve, reject) => {
    let rand = Math.floor(Math.random() * names.length)
    if (msg.member.nickname) {
      msg.channel
        .send(`**${msg.author.username} a.ka. ${msg.member.nickname}**, ai rupeet vittuilee hä?`)
        .catch((error) => console.info(error))
    } else {
      msg.channel.send(`**${msg.author.username}**, ai rupeet vittuilee?`).catch((error) => console.info(error))
    }

    let clientHierarchyId = 0

    msg.guild.members.cache.get(client.user.id).roles.cache.forEach((role) => {
      if (role.position > clientHierarchyId) clientHierarchyId = role.position
    })

    if (msg.member.roles.cache.find((role) => role.position > clientHierarchyId)) {
      msg.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
    } else if (
      msg.guild.members.cache.get(client.user.id).hasPermission('MANAGE_NICKNAMES') &&
      !msg.member.hasPermission('ADMINISTRATOR')
    ) {
      msg.member
        .setNickname(names[rand])
        .then(() =>
          msg.reply(`miltäs kaunis uusi nimesi '${names[rand]}' tuntuu, hä?`).catch((err) => console.info(err))
        )
        .catch((error) => console.info(error))
    } else if (msg.member.hasPermission('ADMINISTRATOR')) {
      msg.reply('Oops, sori oot vissii joku admin kid.').catch((err) => console.info(err))
    } else {
      msg.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.').catch((err) => console.info(err))
    }

    resolve()
  })
}

module.exports.configuration = configuration
