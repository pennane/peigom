module.exports.get = function (isPrecise) {
    let toReturn;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    let hh = today.getHours();
    let ss = today.getSeconds();
    let m = today.getMinutes();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (ss < 10) ss = '0' + ss;
    if (m < 10) m = '0' + m;
    today = mm + '/' + dd + '/' + yyyy;
    todayPrecise = today + ' ' + hh + ':' + m + ':' + ss;
    if (!isPrecise) {
        toReturn = today;
    } else {
        toReturn = todayPrecise;
    }
    return toReturn;
}

module.exports.yyyy = function () {
    let today = new Date();
    let yyyy = today.getFullYear();
    return yyyy;
}
module.exports.mm = function () {
    let today = new Date();
    let mm = today.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    return mm;
}

module.exports.dd = function () {
    let today = new Date();
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    return dd;
}

module.exports.hh = function () {
    let today = new Date();
    let hh = today.getHours();
    if (hh < 10) hh = '0' + hh;
    return hh;
}

module.exports.m = function () {
    let today = new Date();
    let m = today.getMinutes();
    if (m < 10) m = '0' + m;
    return m;
}

module.exports.ss = function () {
    let today = new Date();
    let ss = today.getSeconds();
    if (ss < 10) ss = '0' + ss;
    return ss;
}
