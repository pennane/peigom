const get = (precise?: boolean): string => {
    let today = new Date()
    let dd: number | string = today.getDate(),
        mm: number | string = today.getMonth() + 1,
        yyyy: number | string = today.getFullYear(),
        hh: number | string = today.getHours(),
        ss: number | string = today.getSeconds(),
        m: number | string = today.getMinutes()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm
    if (ss < 10) ss = '0' + ss
    if (m < 10) m = '0' + m

    if (precise) {
        return today + ' ' + hh + ':' + m + ':' + ss
    } else {
        return mm + '/' + dd + '/' + yyyy
    }
}

const yyyy = (): string => {
    let today = new Date()
    let yyyy = today.getFullYear()
    return String(yyyy)
}

const mm = (): string => {
    let today = new Date()
    let mm: number | string = today.getMonth() + 1
    if (mm < 10) mm = '0' + mm
    return String(mm)
}

const dd = (): string => {
    let today = new Date()
    let dd: number | string = today.getDate()
    if (dd < 10) dd = '0' + dd
    return String(dd)
}

const hh = (): string => {
    let today = new Date()
    let hh: number | string = today.getHours()
    if (hh < 10) hh = '0' + hh
    return String(hh)
}

const m = (): string => {
    let today = new Date()
    let m: number | string = today.getMinutes()
    if (m < 10) m = '0' + m
    return String(m)
}
const ss = (): string => {
    let today = new Date()
    let ss: number | string = today.getSeconds()
    if (ss < 10) ss = '0' + ss
    return String(ss)
}

const Time = {
    get,
    yyyy,
    mm,
    dd,
    hh,
    m,
    ss
}

export default Time
