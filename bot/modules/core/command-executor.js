const _ = require('underscore');
const fs = require('fs');
const logger = require('../functions/activity-logger.js');

var exports = module.exports = {}, coms = {}, filearr = [];

fs.readdirSync("./modules/commands/").forEach(file => {
    if (file.endsWith(".js")) {
        filearr.push(file);        
    }  
});

for (file in filearr) {
    var filenm = filearr[file].slice(0, -3);
    coms[filenm] = require(`../commands/${filearr[file]}`);
}

exports.commands = coms;

exports.files = function() {
    return {coms : coms, files : filearr}
};

exports.parse = function(msg, client, command, args) {
    return new Promise((resolve,reject) => {
        if (_.has(coms, command)) {
            coms[command].run(msg, client, args);
        }
        logger.log(1, {msg: msg, command: command, args: args});
        resolve();
    });

}