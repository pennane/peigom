var info = {
    name: "sudo",
    admin: true,
    syntax: "sudo <#text-kanava> <teksti>",
    desc: "Lähettää asettamasi viestin asettamallesi tekstikanavalle."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (args[2]) {
            var channelid = args[1].replace(/\D/g, '');
            var sudochannel = client.channels.get(channelid);
            if (sudochannel) {
                if (args[3]) {
                    for (var i = 3; i < args.length; i++) {
                        args[2] = args[2] + ' ' + args[i];
                    }
                }
                if (typeof (args[2]) !== 'string') {
                    args[2] = args[2].toString();
                }
                sudochannel.send(args[2])
                    .catch(err => console.info(error));
            } else {
                msg.reply(syntax)
                    .then(msg => {
                        msg.delete(15001)
                    })
                    .catch(err => console.info(error));
            }
        } else {
            msg.reply(syntax)
                .then(msg => {
                    msg.delete(15001)
                })
                .catch(err => console.info(error));
        }
        msg.delete(10000);
        resolve();
    });
}

exports.info = info;