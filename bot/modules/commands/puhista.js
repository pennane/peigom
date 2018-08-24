var info = {
    name: "puhista",
    admin: true,
    syntax: "puhista <määrä (2-99)>",
    desc: "Poistaa annetun määrän viestejä kanavalta."
}

var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    if (args[1] >= 2 && args[1] <= 99) {
        var todel = parseInt(args[1]) + 1;
        msg.channel.bulkDelete(todel)
            .then(() => {
                msg.channel.send(`Poistin ${args[1]} viestiä.`)
                    .then(msg => msg.delete(3000));
            });
    } else {
        msg.channel.send(syntax);
    }
}

exports.info = info;