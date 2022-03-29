import dRequest from './index'

export function getSongDetail(ids) {
  return dRequest.get('/song/detail', {
    ids
  })
}

export function getSongLyric(id) {
  return dRequest.get('/lyric', {
    id
  })
}