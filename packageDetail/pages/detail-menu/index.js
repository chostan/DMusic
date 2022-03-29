// packageDetail/pages/detail-menu/index.js
import { getSongMenuTags, getSongMenu } from '../../../service/api_music'

Page({
  data: {
    songMenuList: []
  },
  onLoad: function (options) {
    this.getSongMenuDetail()
  },

  // 网络请求
  async getSongMenuDetail() {
    // 获取分类
    const res = await getSongMenuTags()
    const tags = res.tags
    const songMenuList = []
    const promises = []
    // 保存分类和list到数组
    for (const i in tags) {
      const name = tags[i].name
      songMenuList[i] = { name, list: [] }
      promises.push(getSongMenu(name))
    }
    // 发送请求将获取list
    Promise.all(promises).then((menuLists) => {
      for (const i in menuLists) {
        const menuList = menuLists[i]
        songMenuList[i].list = menuList.playlists
      }
      // 保存数据
      this.setData({ songMenuList })
    })
  },

  // 事件处理
  handleItemClick(e) {
    const id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?id=${id}&type=menu`
    })
  },

  onUnload: function () {

  }
})