import dRequset from './index'

export function getTopMV(offset, limit = 10) {
  return dRequset.get('/top/mv', {
    offset,
    limit
  })
}

/**
 * 请求MV播放地址
 * @param {number} id MV的id 
 */
export function getMVURL(id) {
  return dRequset.get('/mv/url', {
    id
  })
}

/**
 * 请求MV的详情
 * @param {number} mvid MV的id 
 */
export function getMVDetail(mvid) {
  return dRequset.get('/mv/detail', {
    mvid
  })
}

/**
 * 请求MV相关视频
 * @param {number} id MV的id 
 */
export function getRelatedVideo(id) {
  return dRequset.get('/related/allvideo', {
    id
  })
}