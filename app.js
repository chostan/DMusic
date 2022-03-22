// app.js
App({
  globalData: {
    screenWidth: 0
  },
  onLaunch: function() {
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth 
  }
})
