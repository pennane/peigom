var info = {
    name: "spam",
    admin: true,
    syntax: "spam <@pelaaja> <määrä> <viesti>",
    desc: "Lähettää asettamasi viestin asettamallesi pelaajalle asettamasi monta kertaa."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    if (args[3]) {
        var userid = args[1].replace(/\D/g, '');
        if (msg.guild.members.get(userid)) {
            if (typeof (args[2]) !== 'string') {
                args[2] = args[2].toString();
            }
            if (args[4]) {
                for (var i = 4; i < args.length; i++) {
                    args[3] = args[3] + ' ' + args[i];
                }
            }
            for (var i = 0; i < args[2]; i++) {
                msg.guild.members.get(userid)
                    .send(args[3]);
            }
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
    msg.delete(5000);
}

exports.info = info;