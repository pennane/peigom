const config = require('config');
const fs = require('fs');


var info = {
    name: "raha",
    admin: false,
    syntax: "raha <saldo / uhkapeli / lahjoita / kauppa / palkka>",
    desc: "Kosmeettisen virtuaalivaluutan pyörittelyyn",
    sub: {
        "saldo": {
            "syntax": "raha saldo",
            "desc": "Näyttää oman rahatilanteen."
        },
        "uhkapeli": {
            "syntax": "raha uhkapeli <määrä>",
            "desc": "Heittää asettamallasi määrällä kolikkoa. Voitolla tuplaat panoksen, ja häviöllä menetät."
        },
        "lahjoita": {
            "syntax": "raha lahjoita <määrä> <@kenelle>",
            "desc": "Lahjoittaa asettamasi määrän haluamallesi käyttäjälle."
        },
        "kauppa": {
            "syntax": "raha kauppa",
            "desc": "Tällä hetkellä komennolla ei funktiota."
        },
        "palkka": {
            "syntax": "raha palkka",
            "desc": "Antaa sinulle päivän palkan."
        }
    }
}

var exports = module.exports = {};

exports.run = function (msg, client, args) {
    const prefix = config.discord.prefix;
    var syntax = info.syntax;
    var userdata = client.usrdata;
    var daily = config.commands.raha.daily;
    if (!msg.author.bot) {
        var userid = msg.author.id.toString();
        var usrobj;
        if (userdata.users[msg.author.id]) {
            usrobj = userdata.users[msg.author.id];
        } else {
            userdata.users[userid] =
                {
                    "credits": 200
                    , "bot": msg.author.bot
                    , "whenclaimed": (Date.now() - 86400000)
                };
            usrobj = userdata.users[msg.author.id]
        };
        if (args[1]) {
            var subsyntax;
            switch (args[1]) {
                case 'saldo':
                    subsyntax = info.sub[args[1]].syntax;
                    msg.reply(usrobj.credits)
                        .then(msg => {

                        })
                        .catch(error => console.info(error));
                    break;
                case 'uhkapeli':
                    subsyntax = info.sub[args[1]].syntax;
                    if (!isNaN(parseInt(args[2])) && parseInt(args[2]) > 0) {
                        if (parseInt(args[2]) <= parseInt(usrobj.credits)) {
                            msg.channel.send('Käyttäjä ' + msg.author.username + ' uhkapelaa ' + args[2] + ' kolikolla. Lets mennään.')
                                .then(msg => {

                                    ;
                                })
                                .catch(error => console.info(error));

                            function winorlose() {
                                var result = Math.round(Math.random());
                                if (result === 1) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (winorlose()) {
                                msg.channel.send('Voitto!')
                                    .then(msg => {

                                        ;
                                    })
                                    .catch(error => console.info(error));
                                usrobj.credits = parseInt(usrobj.credits) + parseInt(args[2]);
                            } else {
                                msg.channel.send('Häviö!')
                                    .then(msg => {

                                        ;
                                    })
                                    .catch(error => console.info(error));
                                usrobj.credits = parseInt(usrobj.credits) - parseInt(args[2]);
                            }
                        } else {
                            msg.channel.send(msg.author.username + ', ei tarpeeks koleja!')
                                .then(msg => {

                                    ;
                                })
                                .catch(error => console.info(error));
                        }
                    } else {
                        msg.reply(subsyntax)
                            .then(msg => {

                                ;
                            })
                            .catch(error => console.info(error));
                    }
                    break;
                case 'lahjoita':
                    subsyntax = info.sub[args[1]].syntax;
                    if (!isNaN(parseInt(args[2])) && parseInt(args[2]) > 0 && args[3]) {
                        if (parseInt(args[2]) <= parseInt(usrobj.credits)) {
                            var giftTo = '';

                            function gambleCheck(userid) {
                                for (var i = 0; i < userdata.users.length; i++) {
                                    if (userdata.users[i].id == userid) {
                                        giftTo = userdata.users[i];
                                        return true;
                                    }
                                }
                            }
                            if (gambleCheck(args[3].replace(/\D/g, ''))) {
                                usrobj.credits = usrobj.credits - parseInt(args[2]);
                                giftTo.credits = giftTo.credits + parseInt(args[2]);
                                msg.reply('`Lahjoitit ' + parseInt(args[2]) + ' kolikkoa onnistuneesti!`')
                                    .then(msg => {

                                        ;
                                    })
                                    .catch(error => console.info(error));
                            } else {
                                msg.reply('Valitsemasi pelaaja ei ole vielä koskaan käyttänyt komentoa: \`' + prefix + info.name + '\`. Et voi lahjoittaa hänelle.')
                                    .then(msg => {

                                        ;
                                    })
                                    .catch(error => console.info(error));
                            }
                        } else {
                            msg.channel.send(msg.author.username + ', ei tarpeeks koleja!')
                                .then(msg => {

                                    ;
                                })
                                .catch(error => console.info(error));
                        }
                    } else {
                        msg.reply(subsyntax)
                            .then(msg => {

                                ;
                            })
                            .catch(error => console.info(error));
                    }
                    break;
                case 'kauppa':
                    subsyntax = info.sub[args[1]].syntax;
                    msg.channel.send(' <:thonk4:414484594381946910> `**' + (msg.author.username)
                        .toUpperCase() + ', KAUPPA ON SULJETTU**` <:thonk4:414484594381946910>  ')
                        .then(msg => {

                            ;
                        })
                        .catch(error => console.info(error));
                    break;
                case 'palkka':
                    subsyntax = info.sub[args[1]].syntax;
                    if (Date.now() - usrobj.whenclaimed > 86400000) {
                        msg.reply(`Sait päivän palkan, eli ${daily} kolikkelia.`)
                            .then(msg => {

                                ;
                            })
                            .catch(error => console.info(error));
                        usrobj.whenclaimed = Date.now();
                        usrobj.credits = usrobj.credits + daily;
                    } else {
                        var timeremaining = Math.round(((((((usrobj.whenclaimed + 86400000) - Date.now()) / 1000) / 60) / 60) * 100) / 100);
                        msg.reply('Vielä ' + timeremaining + ' tuntia et saat kolikkeleit.')
                            .then(msg => {

                                ;
                            })
                            .catch(error => console.info(error));
                    }
                    break;
                default:
                    msg.reply(syntax)
                        .then(msg => {

                        })
                        .catch(error => console.info(error));
                    break;
            }
        } else {
            msg.reply(syntax)
                .then(msg => {

                    ;
                })
                .catch(error => console.info(error));
        }

        ;
        fs.writeFile("./data/user-data.json", JSON.stringify(userdata), function (err) {
            if (err) {
                return console.info(err);
            }
        });

    }

}

exports.info = info;