const fs = require('fs');
const sharp = require('sharp');
const https = require('https');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);
let info = {
    name: "nightmare",
    admin: false,
    syntax: "nightmare",
    desc: "Lähettää kanavalle suurta kuumotusta."
}
let syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed
            .setTitle("spoky nitemare");

        function rest() {
            var rand = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            var flashback = './images/flashback.png';
            var imgname = `./images/${rand}.jpg`;
            var imgname = String(imgname);

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
                        .catch(err => console.log(err))

                })
                .catch(err => console.log(err));
        }
        var avatar = msg.author.avatarURL;
        var avatarfile = `./images/avatars/avatar${msg.author.id}${Date.now()}.jpg`;
        var i = 0;
        if (fs.existsSync(avatarfile)) {
            rest();
        }
        if (!fs.existsSync(avatarfile)) {
            var file = fs.createWriteStream(avatarfile);
            var request = https.get(avatar, function (response) {
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
exports.info = info;