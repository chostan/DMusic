// pages/home-video/index.js
import { getTopMV } from '../../service/api_video'

Page({
  data: {
    topMvs: [],
    hasMore: true
  },
  onLoad: function (options) {
    this.getTopMVData(0)
  },

  // 封装网络请求的方法
  getTopMVData: async function(offset) {
    // 判断是否可以请求
    if(!this.data.hasMore && offset !== 0) return

    // 展示加载动画
    wx.showNavigationBarLoading()

    // 真正请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMvs
    if(offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    // 设置数据
    this.setData({topMvs: newData})
    this.setData({hasMore: res.hasMore})
    wx.hideNavigationBarLoading()
    if(offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  // 封装事件处理的方法
  handleVideoItemClick: function(event) {
    // 获取id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
  },

  // 其他的生命周期回调函数
  onPullDownRefresh: function() {
    this.getTopMVData(0)
  },

  onReachBottom: function() {
    // if(!this.data.hasMore) return;
    // const res = await getTopMV(this.data.topMvs.length)
    // this.setData({topMvs: this.data.topMvs.concat(res.data)})
    // this.setData({hasMore: res.hasMore})
    this.getTopMVData(this.data.topMvs.length)
  }
})