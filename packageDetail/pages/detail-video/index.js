// pages/detail-video/index.js
import {
  getMVURL,
  getMVDetail,
  getRelatedVideo
} from '../../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: [],
    danmuList: []
    // danmuList: [{
    //   text: '第 1s 出现的弹幕',
    //   color: '#ff0000',
    //   time: 1
    // }, {
    //   text: '第 3s 出现的弹幕',
    //   color: '#ff00ff',
    //   time: 3
    // }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id

    // 获取页面的数据
    this.getPageData(id)
  },

  // 网络请求
  getPageData: function (id) {
    //1. 请求播放地址
    getMVURL(id).then(res => {
      this.setData({
        mvURLInfo: res.data
      })
    })
    // 2.请求视频信息
    getMVDetail(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    })
    // 3.请求相关视频
    getRelatedVideo(id).then(res => {
      this.setData({
        relatedVideos: res.mvs
      })
    })
  },

  // 事件处理
  handleVideoItemClick: function(event) {
    const id = event.currentTarget.dataset.item.id
    // 重新发送请求
    this.getPageData(id)
  }
})