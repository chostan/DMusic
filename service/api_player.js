import dRequset from './index'
import dRequest from './index'

export function getSongDetail(ids) {
  return dRequset.get('/song/detail', {
    ids
  })
}

export function getSongLyric(id) {
  return dRequset.get('/lyric', {
    id
  })
}