const configuration = {
  name: 'emojis',
  admin: false,
  syntax: 'emojis',
  desc: 'Lähettää kanavalle kaikki botin tuntemat emojit',
  triggers: ['emojis', 'emojit'],
  type: ['utility', 'fun']
}

module.exports.executor = function (msg, client, args) {
  return new Promise((resolve, reject) => {
    let emojis = client.emojis.cache
    let messages = ['']
    let i = 0
    emojis.forEach((emoji) => {
      if (!emoji.available) return
      if ((messages[i] + emoji.toString() + ' ').length > 1800) {
        i++
        messages[i] = ''
      }
      messages[i] += emoji.toString() + ' '
    })
    messages.forEach((message) => {
      msg.channel.send(message).catch((err) => console.info(err))
    })

    resolve()
  })
}

module.exports.configuration = configuration
