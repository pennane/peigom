const fs = require('fs');
const sharp = require('sharp');
const https = require('https');


var info = {
    name: "vietnam",
    admin: false,
    syntax: "vietnam",
    desc: "Lähettää kanavalle vietnam fläshbäkkejä."
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

            sharp(avatarfile)
                .resize(256, 256)
                .grayscale()
                .overlayWith(flashback, { gravity: sharp.gravity.southeast })
                .jpeg({ quality: 60 })
                .toFile(imgname)
                .then(image => {
                    msg.channel.send({
                        file: imgname
                    })
                        .then(image => {
                            fs.unlinkSync(imgname);
                            fs.unlinkSync(avatarfile);
                        })
                });
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