var exports = module.exports = {};
exports.get = function (isPrecise) {
        var toReturn;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var ss = today.getSeconds();
        var m = today.getMinutes();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        if (ss < 10) ss = '0' + ss;
        if (m < 10) m = '0' + m;
        today = mm + '/' + dd + '/' + yyyy;
        todayPrecise = today + ' '+hh+':'+m+':'+ss;
        if (!isPrecise) {
            toReturn = today;
        } else {
            toReturn = todayPrecise;
        }
            return toReturn;
}
var today = new Date();
exports.yyyy = function() {
    var yyyy = today.getFullYear();
    return yyyy;
}
exports.mm = function() {
    var mm = today.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    return mm;
}

exports.dd = function() {
    var dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    return dd;
}

exports.hh = function() {
    var hh = today.getHours();
    if (hh < 10) hh = '0' +hh;
    return hh;
}

exports.m = function() {
    var m = today.getMinutes();
    if (m < 10) m = '0'+m;
    return m;
}

exports.ss = function() {
    var ss = today.getSeconds();
    if (ss < 10) ss = '0' + ss;
    return ss;
}
