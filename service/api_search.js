import dRequest from './index'

export function getSearchHot() {
  return dRequest.get('/search/hot')
}

export function getSearchSuggest(keywords) {
  return dRequest.get('/search/suggest', {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(keywords, offset = 0, limit = 30) {
  return dRequest.get('/search', {
    keywords,
    offset,
    limit
  })
}