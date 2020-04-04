const fs = require('fs');
const sharp = require('sharp');
const https = require('https');
const Discord = require('discord.js');

const configuration = {
    name: "minime",
    admin: false,
    syntax: "minime",
    desc: "Lähettää kanavalle mini sinut.",
    triggers: ["minime"],
    type: ["image"]
}

let embed = new Discord.MessageEmbed().setColor(0xF4E542);



module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        function rest() {
            let rand = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            let flashback = './assets/images/flashback.png';
            let imgname = `./assets/images/${rand}.jpg`;
            imgname = String(imgname);
            embed
                .setTitle("Mini me");

            sharp(avatarfile)
                .resize(16, 16)
                .jpeg({ quality: 90 })
                .toFile(imgname)
                .then(image => {
                    embed.setImage(`attachment://minime.jpg`);
                    msg.channel.send({
                        embed: embed,
                        files: [{
                            attachment: imgname,
                            name: 'minime.jpg'
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
        let avatar = msg.author.avatarURL();
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
    })

}
module.exports.configuration = configuration;