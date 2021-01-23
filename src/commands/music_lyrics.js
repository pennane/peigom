const fetch = require('node-fetch')
const cheerio = require('cheerio')

const Discord = require('discord.js')
const { GENIUS_ACCESS_TOKEN } = require('../utilities/config')
const GeniusApi = require('genius-api')
const Genius = new GeniusApi(GENIUS_ACCESS_TOKEN)

const { queue } = require('../core/sound.js')

let embed = new Discord.MessageEmbed().setColor(0xf4e542)

const configuration = {
  name: 'lyrics',
  admin: false,
  syntax: 'lyrics <song query> ',
  desc: 'näyttää kappaleen lyriikat, bro. jos et anna argumenttei ni näyttää soitettavan biisin sanat',
  triggers: ['lyrics', 'sanat', 'sanoitukset', 'lyriikat', 'mitähelvettiäselaulaa'],
  type: ['music']
}

module.exports.executor = function (msg, client, args) {
  return new Promise(async (resolve, reject) => {
    const normalizeQuery = (name) => name.replace(/\./g, '').toLowerCase() // regex removes dots

    function didNotFindLyrics() {
      msg.channel.send('Did not löytää sanoitukset : (((')
    }

    function divideStringToChunks(str, size) {
      const numChunks = Math.ceil(str.length / size)
      const chunks = new Array(numChunks)

      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
      }

      return chunks
    }

    function parseSongHTML(htmlText) {
      const $ = cheerio.load(htmlText)
      const lyrics = $('.lyrics').text()
      const releaseDate = $('release-date .song_info-info').text()
      return {
        lyrics,
        releaseDate
      }
    }

    let normalizedQuery

    if (args[1]) {
      if (args[2]) {
        for (let i = 2; i < args.length; i++) {
          args[1] = args[1] + ' ' + args[i]
        }
      }
      normalizedQuery = normalizeQuery(args[1])
    } else {
      let guild = msg.guild
      let currentGuildQueue = queue.queueReadOnly({ guild: guild })
      if (!currentGuildQueue) return

      normalizedQuery = normalizeQuery(currentGuildQueue.tracks[0].title)
    }

    let searchResponse = await Genius.search(normalizedQuery)
    let hit = searchResponse.hits[0]
    if (!hit || hit.type !== 'song') {
      return didNotFindLyrics()
    }

    let geniusHtml = await fetch(hit.result.url, {
      method: 'GET'
    })

    if (!geniusHtml.ok) throw new Error('Could not get song url ...')

    let parsedHtmlText = parseSongHTML(await geniusHtml.text())

    let lyrics = parsedHtmlText.lyrics

    if (lyrics.length < 10) return didNotFindLyrics()

    if (lyrics.length < 1900) {
      return msg.channel.send(lyrics.trim()).catch((err) => console.error(err))
    }

    let chunks = divideStringToChunks(lyrics, 1900)

    if (chunks.length > 5) {
      return msg.channel.send('bro too wordy song, discord be like ratelimit')
    }

    chunks.forEach((chunk) => {
      let part = chunk.trim()
      msg.channel.send(`\`\`\`${part}\`\`\``).catch((err) => console.error(err))
    })

    resolve()
  })
}
module.exports.configuration = configuration
