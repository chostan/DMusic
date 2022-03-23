import dRequset from './index'
import dRequest from './index'

export function getBanners() {
  return dRequset.get('/banner', {
    type: 2
  })
}

export function getRankings(idx) {
  return dRequset.get('/top/list', {
    idx
  })
}

export function getSongMenu(cat="全部", limit=6, offset=0) {
  return dRequset.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return dRequset.get('/playlist/detail/dynamic', {
    id
  })
}