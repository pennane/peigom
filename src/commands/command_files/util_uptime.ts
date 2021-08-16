import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'uptime',
    admin: false,
    syntax: 'uptime',
    desc: 'Kertoo botin tähänastisen käynnissäoloajan',
    triggers: ['uptime'],
    type: ['utility']
}

const executor: CommandExecutor = async (message, client, args) => {
    let embed = Command.createEmbed()
    embed.setTitle('Botin uptime:')

    if (!client?.uptime) {
        embed.description = `Botti on kadonnut matriisiin, ja jostain syystä päälläoloaikaa ei ole saatavilla.`
        message.channel.send({ embeds: [embed] })
        return
    }

    let totalSeconds = client.uptime / 1000,
        h = Math.trunc(totalSeconds / 3600),
        totalRemainder = totalSeconds % 3600,
        m = Math.trunc(totalRemainder / 60),
        s = Math.trunc(totalRemainder % 60)

    let up = {
        h: '',
        m: '',
        s: ''
    }

    if (h > 1) {
        up.h = `**${h}** tuntia, `
    } else if (h === 1) {
        up.h = `**${h}** tunnin `
    } else if (m > 1) {
        up.m = `**${m}** minuuttia `
    } else if (m === 1) {
        up.m = `**${m}** minuutin `
    } else if (s > 1) {
        up.s = `**${s}** sekuntia`
    } else if (s <= 1) {
        up.s = `**1** sekunnin`
    }

    embed.setDescription(`Tää botti o ollu hereillä jo ${up.h}${up.m}${up.s} :hourglass_flowing_sand:`)

    message.channel.send({ embeds: [embed] })
}

export default new Command({
    configuration,
    executor
})
