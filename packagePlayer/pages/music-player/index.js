// pages/music-player/index.js
// import { getSongDetail, getSongLyric } from '../../service/api_player'
// import { parseLyric } from '../../utils/parse-lyric'
import { audioContext, playerStore } from '../../../store/index'
import showToast from '../../../utils/toast'

const playModeNames = ['order', 'repeat', 'random']

Page({
  data: {
    id: 0,

    currentSong: {},
    lyricInfos: [],
    durationTime: 0,
    
    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    isPlaying: false,
    playingName: 'pause',

    playModeIndex: 0,
    playModeName: 'order',

    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // playerStore.dispatch('playMusicWithSongIdAction', { id: 1842025914 })

    // 2.根据id获取歌曲信息
    // this.getPageData(id)
    this.setupPlayerStoreListener()

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })

    // 4.使用audioContext播放歌曲
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true

    // 5.audioContext的事件监听
    // this.setupAudioContextListener()
  },

  // ================   网络请求   ================
  // getPageData: function(id) {
  //   getSongDetail(id).then(res => {
  //     this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
  //   })

  //   getSongLyric(id).then(res => {
  //     const lyricString = res.lrc.lyric
  //     const lyrics = parseLyric(lyricString)
  //     this.setData({ lyricInfos: lyrics })
  //   })
  // },

  // ================   audio监听   ================
  setupAudioContextListener: function() {
    // audioContext.onCanplay(() => {
    //   audioContext.play()
    // })
    // // 监听时间改变
    // audioContext.onTimeUpdate(() => {
    //   // 1.获取当前时间
    //   const currentTime = audioContext.currentTime * 1000

    //   // 2.根据当前时间修改currentTime/sliderValue
    //   if(!this.data.isSliderChanging) {
    //     const sliderValue = currentTime / this.data.durationTime * 100
    //     this.setData({ sliderValue, currentTime })
    //   }

    //   // 3.根据当前时间查找播放的歌词
    //   if(!this.data.lyricInfos.length) return
    //   let i = 0
    //   for(; i < this.data.lyricInfos.length; i++) {
    //     const lyricInfo = this.data.lyricInfos[i]
    //     if(currentTime < lyricInfo.time) {
    //       break
    //     }
    //   }

    //   // 设置当前歌词的索引和内容
    //   const currentIndex = i - 1
    //   if(this.data.currentLyricIndex !== currentIndex) {
    //     const currentLyricInfo = this.data.lyricInfos[currentIndex]
    //     this.setData({ 
    //       currentLyricText: currentLyricInfo.text, 
    //       currentLyricIndex: currentIndex,
    //       lyricScrollTop: currentIndex * 35
    //     })
    //   }
    // })
  },

  // ================   事件处理   ================
  handleSwiperChange: function(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },

  handleSliderChanging: function(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  },

  handleSliderChange: function(event) {
    // 1.获取slider变化的值
    const value = event.detail.value
    
    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100

    // 3.设置context播放currentTime位置的音乐
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    audioContext.onCanplay(() => {
      audioContext.play()
    })

    // 4.记录最新的sliderValue并且将isSliderChanging设置为false
    this.setData({ sliderValue: value, isSliderChanging: false })
  },

  handleBackBtnClick: function() {
    wx.navigateBack()
  },

  handleModeClick: function() {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex === 3) playModeIndex = 0

    playerStore.setState('playModeIndex', playModeIndex)
  },

  handlePlayBtnClick: function() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },

  handlePrevBtnClick: function() {
    playerStore.dispatch('changeNewMusicAction', false)
  },

  handleNextBtnClick: function() {
    playerStore.dispatch('changeNewMusicAction')
  },

  handleShowSongList: function() {
    showToast('正在开发中')
  },


  // ================   数据监听   ================
  handleCurrentMusicListener: function({currentSong, durationTime, lyricInfos}) {
    if(currentSong) this.setData({ currentSong })
    if(durationTime) this.setData({ durationTime })
    if(lyricInfos) this.setData({ lyricInfos })
  },

  setupPlayerStoreListener: function() {
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], this.handleCurrentMusicListener)

    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if(currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if(currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if(currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    // 3.监听播放模式相关的数据
    playerStore.onStates(['playModeIndex', 'isPlaying'], ({
      playModeIndex, 
      isPlaying
    }) => {
      if(playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
      }
      if(isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? 'pause': 'resume'
        })
      }
    })
  },

  onUnload: function () {
    playerStore.offStates(
      ['currentSong', 'durationTime', 'lyricInfos'], 
      this.handleCurrentMusicListener
    )
  }
})