const fs = require('fs');
const sharp = require('sharp');
const https = require('https');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "vietnam",
    admin: false,
    syntax: "vietnam",
    desc: "Lähettää kanavalle vietnam fläshbäkkejä.",
    triggers: ["vietnam", "nam"],
    type: ["image"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed
            .setTitle("Fläsbäkit");
        function rest() {
            let rand = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            let flashback = './assets/images/flashback.png';
            let imgname = `./assets/images/${rand}.jpg`;
            imgname = String(imgname);

            sharp(avatarfile)
                .resize(256, 256)
                .grayscale()
                .composite([{ input: flashback, gravity: 'southeast' }])
                .jpeg({ quality: 60 })
                .toFile(imgname)
                .then(image => {
                    embed.setImage(`attachment://flashback.jpg`);
                    msg.channel.send({
                        embed: embed,
                        files: [{
                            attachment: imgname,
                            name: 'flashback.jpg'
                        }]
                    })
                        .then(image => {
                            fs.unlinkSync(imgname);
                            fs.unlinkSync(avatarfile);
                        })
                        .catch(err => console.info(err));
                })
                .catch(err => console.info(err))
        }
        let targetUser = args[1] ? msg.guild.members.cache.get(args[1].replace(/\D/g, '')).user : msg.author
        if (!targetUser) {
            return resolve()
        }
        let avatar = targetUser.avatarURL();
        let avatarfile = `./assets/images/avatars/avatar${targetUser.id}${Date.now()}.jpg`;
        let i = 0;
        if (fs.existsSync(avatarfile)) {
            rest();
        }
        if (!fs.existsSync(avatarfile)) {
            let file = fs.createWriteStream(avatarfile);
            let request = https.get(avatar, function (response) {
                response.pipe(file)
            });
            file.on('finish', function () {
                i++;
                if (i = 1) {
                    rest();
                }
            });


        }
        resolve();
    })

}
module.exports.configuration = configuration;