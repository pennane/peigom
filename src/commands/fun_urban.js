const Discord = require('discord.js')
const dictionary = require('urban-dictionary')
const syntaxEmbed = require('../utilities/syntaxEmbed')

const configuration = {
    name: 'urban',
    admin: false,
    syntax: 'urban <sana>',
    desc: 'Hakee selitteen sanalle',
    triggers: ['urban', 'dictionary', 'define'],
    type: ['fun']
}

module.exports.executor = async (msg, client, args) => {
    if (!args[1]) {
        msg.channel.send(syntaxEmbed({ configuration }))
        return
    }

    let toDefine = args.slice(1).join(' ')

    try {
        let results = await dictionary.define(toDefine)
        let entry = results[0]
        let embed = new Discord.MessageEmbed().setColor(0xf4e542)
        embed.setTitle('Urbanaba Sanababa')
        embed.addField(
            toDefine,
            `${entry.definition.replace(/\[|\]/g, '')}\n*${entry.example.replace(/\[|\]/g, '')}*\n[Link](${
                entry.permalink
            })`
        )
        embed.setFooter(entry.author, 'https://arttu.pennanen.org/file/thonk.gif')
        embed.setTimestamp()
        msg.channel.send(embed)
    } catch (e) {
        msg.channel.send(`Ei löytyny selitystä sanomalle ${toDefine}`)
    }
}

module.exports.configuration = configuration
