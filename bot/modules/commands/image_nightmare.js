const fs = require('fs');
const sharp = require('sharp');
const https = require('https');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);
const meta = {
    name: "nightmare",
    admin: false,
    syntax: "nightmare",
    desc: "Lähettää kanavalle suurta kuumotusta.",
    triggers: ["nightmare", "nitemare"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed.setTitle("spoky nitemare");

        function rest() {
            let rand = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            let flashback = './assets/images/flashback.png';
            let imgname = `./assets/images/${rand}.jpg`;
            imgname = String(imgname);

            sharp(avatarfile)
                .resize(256, 256)
                .threshold(120)
                .jpeg()
                .toFile(imgname)
                .then(image => {
                    embed.setImage(`attachment://night.jpg`);
                    msg.channel.send({
                        embed: embed,
                        files: [{
                            attachment: imgname,
                            name: 'night.jpg'
                        }]
                    })
                        .then(image => {
                            fs.unlinkSync(imgname);
                            fs.unlinkSync(avatarfile);
                        })
                        .catch(err => console.info(err))

                })
                .catch(err => console.info(err));
        }
        let avatar = msg.author.avatarURL;
        let avatarfile = `./assets/images/avatars/avatar${msg.author.id}${Date.now()}.jpg`;
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
    });
}
module.exports.meta = meta;