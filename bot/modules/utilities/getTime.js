module.exports = {
    get: function (precise) {
        let today = new Date();
        let dd = today.getDate(),
            mm = today.getMonth() + 1,
            yyyy = today.getFullYear(),
            hh = today.getHours(),
            ss = today.getSeconds(),
            m = today.getMinutes();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        if (ss < 10) ss = '0' + ss;
        if (m < 10) m = '0' + m;

        if (precise) {
            return  today + ' ' + hh + ':' + m + ':' + ss
        } else {
            return  mm + '/' + dd + '/' + yyyy;
        }
    },
    yyyy: function () {
        let today = new Date();
        let yyyy = today.getFullYear();
        return yyyy;
    },
    mm: function () {
        let today = new Date();
        let mm = today.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        return mm;
    },

    dd: function () {
        let today = new Date();
        let dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        return dd;
    },

    hh: function () {
        let today = new Date();
        let hh = today.getHours();
        if (hh < 10) hh = '0' + hh;
        return hh;
    },

    m: function () {
        let today = new Date();
        let m = today.getMinutes();
        if (m < 10) m = '0' + m;
        return m;
    },
    ss: function () {
        let today = new Date();
        let ss = today.getSeconds();
        if (ss < 10) ss = '0' + ss;
        return ss;
    }

}