const get = (precise?: boolean): string => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0'),
    mm = String(today.getMonth() + 1).padStart(2, '0'),
    yyyy = String(today.getFullYear()),
    hh = String(today.getHours()).padStart(2, '0'),
    ss = String(today.getSeconds()).padStart(2, '0'),
    m = String(today.getMinutes()).padStart(2, '0')

  if (precise) {
    return today + ' ' + hh + ':' + m + ':' + ss
  } else {
    return mm + '/' + dd + '/' + yyyy
  }
}

const yyyy = (): string => {
  const today = new Date()
  const yyyy = today.getFullYear()
  return String(yyyy)
}

const mm = (): string => {
  const today = new Date()
  let mm: number | string = today.getMonth() + 1
  if (mm < 10) mm = '0' + mm
  return String(mm)
}

const dd = (): string => {
  const today = new Date()
  let dd: number | string = today.getDate()
  if (dd < 10) dd = '0' + dd
  return String(dd)
}

const hh = (): string => {
  const today = new Date()
  let hh: number | string = today.getHours()
  if (hh < 10) hh = '0' + hh
  return String(hh)
}

const m = (): string => {
  const today = new Date()
  let m: number | string = today.getMinutes()
  if (m < 10) m = '0' + m
  return String(m)
}
const ss = (): string => {
  const today = new Date()
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
