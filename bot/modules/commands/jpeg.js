const fs = require('fs');
const sharp = require('sharp');
const https = require('https');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

var info = {
    name: "jpeg",
    admin: false,
    syntax: "jpeg",
    desc: "Luulekko et mä tiedän mikä jpeg on? Haluun vaa kuvan mun hodarista."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        function rest() {
            var rand = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            var flashback = './images/flashback.png';
            var imgname = `./images/${rand}.jpg`;
            var imgname = String(imgname);
            embed
                .setTitle("Hyper jpeg laatu");
            sharp(avatarfile)
                .resize(256, 256)
                .jpeg({ quality: 1 })
                .toFile(imgname)
                .then(image => {
                    embed.setImage(`attachment://jpeg.jpg`);
                    msg.channel.send({
                        embed: embed,
                        files: [{
                            attachment: imgname,
                            name: 'jpeg.jpg'
                        }]
                    })
                        .then(image => {

                            fs.unlinkSync(imgname);
                            fs.unlinkSync(avatarfile);
                        })
                        .catch(err => console.log(err));
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
    })

}
exports.info = info;