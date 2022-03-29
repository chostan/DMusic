import dRequest from './index'

export function getBanners() {
  return dRequest.get('/banner', {
    type: 2
  })
}

export function getRankings(idx) {
  return dRequest.get('/top/list', {
    idx
  })
}

// 获取分类
export function getSongMenuTags() {
  return dRequest.get('/playlist/hot')
}

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return dRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return dRequest.get('/playlist/detail/dynamic', {
    id
  })
}