import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import ytdl from 'ytdl-core'
import { yt, queueMethods, Track } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    name: 'playtop',
    admin: false,
    syntax: 'play <hakusanat / linkki>',
    desc: 'soita musiikkia youtubesta ja viskoo sen jonon ekaksi',
    triggers: ['playtop', 'pt'],
    type: ['music'],
    requireGuild: true
}

let youtubeLinkRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/

const executor: CommandExecutor = async (message, client, args) => {
    let voiceChannel = message.member?.voice.channel
    let guild = message.guild

    if (!message.member || !guild) return

    if (!voiceChannel) return message.reply('Mene ensin jollekin puhekanavalle, kid.')

    if (voiceChannel.type === 'GUILD_STAGE_VOICE') return

    if (!args[1]) {
        let embed = Command.syntaxEmbed({ configuration, heading: ':point_up: Missä hakusanat' })
        message.channel.send({ embeds: [embed] })
        return
    }

    let query = [...args].splice(1).join(' ')
    let url = [...args][1].replace(/<(.+)>/g, '$1')

    let track: Track | null

    message.channel.send(`:mag: Etitään \`${query}\``)

    if (!url.match(youtubeLinkRegex)) {
        try {
            let queried = await yt.searchVideos(query, 1, { part: 'id' })
            track = await ytdl.getBasicInfo(queried[0].url)
        } catch (err) {
            track = null
            console.error(err)
            message.reply(":baby: Ei löy'y tollasta vidii bro")
        }
    } else {
        message.channel.send(`:mag: Etitään \`${url}\``)
        track = await ytdl.getBasicInfo(url)
    }

    if (!track) {
        return message.channel.send(':baby: Bro keissi keissi, ei toimi bro')
    }

    track.requestedBy = message.member
    track.toTop = true

    queueMethods.add({
        track: track,
        voiceChannel: voiceChannel,
        guild: guild,
        message: message
    })

    return
}

export default new Command({
    configuration,
    executor
})
