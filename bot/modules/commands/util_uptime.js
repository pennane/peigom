const Discord = require('discord.js');




const meta = {
    name: "uptime",
    admin: false,
    syntax: "uptime",
    desc: "Kertoo botin tähänastisen käynnissäoloajan",
    triggers: ["uptime"],
    type: ['utility']
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed().setColor(0xF4E542);
        embed.setTitle("Botin kommentti:");
        if (!client.uptime) {
            embed.description = `Botti on kadonnut matriisiin, ja jostain syystä päälläoloaikaa ei ole saatavilla.`;
            msg.channel.send(embed)
                .catch(err => console.info(err))
            return resolve()
        }

        let ms = client.uptime,
            ts = client.uptime / 1000,
            h = Math.trunc(ts / 3600),
            tsr = ts % 3600,
            m = Math.trunc(tsr / 60),
            s = Math.trunc(tsr % 60)


        let uptimeMessage = {
            h: "",
            m: "",
            s: ""
        }

        embed.setTitle("Botin uptime:")


        if (h > 1) {
            uptimeMessage.h = `**${h}** tuntia, `;
        } else if (h === 1) {
            uptimeMessage.h = `**${h}** tunnin `;
        }
        else if (m > 1) {
            uptimeMessage.m = `**${m}** minuuttia `;
        } else if (m === 1) {
            uptimeMessage.m = `**${m}** minuutin `;
        } else if (s > 1) {
            uptimeMessage.s = `**${s}** sekuntia`;
        } else if (s <= 1) {
            uptimeMessage.s = `**1** sekunnin`;
        }
        embed.setDescription(`Tää botti o ollu hereillä jo ${uptimeMessage.h}${uptimeMessage.m}${uptimeMessage.s} :hourglass_flowing_sand:`)
        msg.channel.send(embed)
            .catch(err => console.info(err))
        resolve();
    });

}

module.exports.meta = meta;