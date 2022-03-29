// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../../service/api_search'
import { playerStore } from '../../../store/player-store'
import debounce from '../../../utils/debounce'
import stringToNodes from '../../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest, 500)

Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: '',

    hasMore: true
  },
  onLoad: function (options) {
    // 1.获取页面的数据
    this.getPageData()
  },

  // 网络请求
  getPageData: function() {
    getSearchHot().then(res => {
      this.setData({hotKeywords: res.result.hots})
    })
  },
  
  getSearchResultData: async function(keywords, offset = 0) {
    // 判断是否可以请求
    if(!this.data.hasMore && offset !== 0) {
      showToast('没有更多了')
      return
    }

    // 展示加载动画
    wx.showNavigationBarLoading()

    // 真正请求数据
    const res = await getSearchResult(keywords, offset)
    let newData = this.data.resultSongs
    if(offset === 0) {
      newData = res.result.songs
    } else {
      newData = newData.concat(res.result.songs)
    }
    // 设置数据
    this.setData({resultSongs: newData})
    this.setData({hasMore: res.result.hasMore})
    wx.hideNavigationBarLoading()
    if(offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  // 事件处理
  handleSearchChange: function(event) {
    // 获取输入的关键字
    const searchValue = event.detail
    // 保存关键字
    this.setData({ searchValue })
    this.setData({ resultSongs: [] })
    // 判断关键字为空字符串的处理逻辑
    if(!searchValue.length) {
      this.setData({ suggestSongs: [], resultSongs: []  })
      debounceGetSearchSuggest.cancel()
      return
    }
    // 根据关键字进行搜索
    let searchValueResult = searchValue.replace(/(^\s*)|(\s*$)/g,"")
    if(searchValueResult) {
      debounceGetSearchSuggest(searchValueResult).then(res => {
        // if(!this.data.searchValue.length) {
        //   console.log('searchValue没有值')
        //   return
        // }
        // 1.获取建议的关键字歌曲
        const suggestSongs = res.result.allMatch
        this.setData({ suggestSongs })
        if(!suggestSongs) return
  
        // 2.转成nodes节点
        const suggestKeywords = suggestSongs.map(item => item.keyword)
        const suggestSongsNodes = []
        for(const keyword of suggestKeywords) {
          const nodes = stringToNodes(keyword, searchValue)
          suggestSongsNodes.push(nodes)
        }
        this.setData({ suggestSongsNodes })
      })
    }
  },

  handleSearchAction() {
    let searchValue = this.data.searchValue
    searchValue = searchValue.replace(/(^\s*)|(\s*$)/g,"")
    this.setData({ searchValue })
    if(searchValue) {
      this.getSearchResultData(searchValue, 0)
    }
    // getSearchResult(searchValue).then(res => {
    //   this.setData({ resultSongs: res.result.songs })
    // })
  },

  handleKeywordItemClick: function(event) {
    // 1.获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword
    
    // 2.将关键字设置到searchValue中
    this.setData({ searchValue: keyword })

    // 3.发送网络请求
    this.handleSearchAction()
  },

  handleSongItemClick: function(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.resultSongs)
    playerStore.setState('playListIndex', index)
  },

  onReachBottom: function() {
    const searchValue = this.data.searchValue
    this.getSearchResultData(searchValue, this.data.resultSongs.length)
  }
})