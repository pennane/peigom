import { yt } from '../sound_handling/sound'
import fs from 'fs'
import https from 'https'

import ytdl from 'ytdl-core'
import memoize from 'memoizee'

export function arrayToChunks<T>(arr: T[], chunkSize: number): Array<T[]> {
  const chunks = []
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize)
    chunks.push(chunk)
  }
  return chunks
}

export function fetchFile({
  url,
  target
}: {
  url: string
  target: string
}): Promise<string> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(target)

    https.get(url, function (response) {
      response.pipe(file)
    })

    file.on('finish', function () {
      resolve(target)
    })
  })
}

export function msToReadable(ms: number) {
  const min = Math.floor(ms / 60000)
  const sec = ((ms % 60000) / 1000).toFixed(0)
  return min + ':' + (Number(sec) < 10 ? '0' : '') + sec
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const s = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[s]] = [a[s], a[i]]
  }
  return a
}

export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

const YOUTUBE_LINK_REGEX =
  /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?[\w?=]*)?/

const getSearchResults = memoize(
  async (searchString: string) => {
    return await yt.searchVideos(searchString, 1, { part: 'id' })
  },
  {
    promise: true,
    maxAge: 1000 * 60 * 60 * 24 // one day
  }
)
const getBasicInfo = memoize(
  async (searchString: string) => {
    return await ytdl.getBasicInfo(searchString)
  },
  {
    promise: true,
    maxAge: 1000 * 60 * 60 * 24 // one day
  }
)

export const getYoutubeVideo = memoize(
  async (searchString: string) => {
    if (YOUTUBE_LINK_REGEX.test(searchString)) {
      const track = await getBasicInfo(searchString)
      return track
    }
    const [searchResult] = await getSearchResults(searchString)

    if (!searchResult) return null

    const info = await getBasicInfo(searchResult.url)

    return info
  },
  {
    promise: true,
    maxAge: 1000 * 60 * 60 * 24 // one day
  }
)

export const ONE_HOUR_MS = 1000 * 60 * 60
export const ONE_DAY_MS = 24 * ONE_HOUR_MS

export function getDayDifferenceCeil(msA: number, msB: number) {
  const msDist = Math.abs(msA - msB)
  const days = Math.ceil(msDist / ONE_DAY_MS)

  return days
}
