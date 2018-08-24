var info = {
    name: "sudopm",
    admin: true,
    syntax: "sudopm <@käyttäjä> <teksti>",
    desc: "Lähettää asettamasi viestin asettamallesi pelaajalle."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    if (args[2]) {
        var userid = args[1].replace(/\D/g, '');
        var sudouser = msg.guild.members.get(userid);
        if (sudouser) {
            if (args[3]) {
                for (var i = 3; i < args.length; i++) {
                    args[2] = args[2] + ' ' + args[i];
                }
            }
            if (typeof (args[2]) !== 'string') {
                args[2] = args[2].toString();
            }
            sudouser.send(args[2]);
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
    msg.delete(1200);
}

exports.info = info;