import dRequset from './index'
import dRequest from './index'

export function getSearchHot() {
  return dRequest.get('/search/hot')
}

export function getSearchSuggest(keywords) {
  return dRequset.get('/search/suggest', {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(keywords) {
  return dRequset.get('/search', {
    keywords
  })
}