// pages/player/index.js
let musicList = []
let nowPlayingIndex = 0 //当前播放音乐的index
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false, 
    isShowLyric:false,//是否显示歌词
    lyric:'',
    isSame:false //是否点击同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.index
    musicList = wx.getStorageSync('musicList')
    this.loadMusicDetail(options.musicId)
  },
  //加载音乐相关信息
  loadMusicDetail(musicId){
    //点击同一首歌
    this.setData({
      isSame: musicId === app.getPlayMusicId(musicId) ? true : false
    })
    !this.data.isSame ? backgroundAudioManager.stop() : ''
    let playingMusic = musicList[nowPlayingIndex]
    console.log(playingMusic);
    wx.setNavigationBarTitle({
      title: playingMusic.name
    })
    this.setData({
      picUrl:playingMusic.al.picUrl,
      isPlaying:false
    })
    app.setPlayMusicId(musicId)
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:'musicUrl'
      }
    }).then(({result})=>{
      console.log(result);
      if(result.data[0].url === null) {
        wx.showToast({
          title: '会员专享，暂时无法播放哦~',
        })
        return
      }
      if(!this.data.isSame){
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = playingMusic.name
        backgroundAudioManager.coverImgUrl = playingMusic.al.picUrl
        backgroundAudioManager.epname = playingMusic.al.name
        backgroundAudioManager.singer = playingMusic.ar[0].name
        this.getPlayHistory()
      }
      if(!this.data.isSame || !app.getIsPause()){
        this.setData({
          isPlaying:true
        })
      }
      wx.hideLoading()
      //加载歌词
      wx.cloud.callFunction({
        name:'music',
        data:{
          musicId,
          $url:'lyric'
        }
      }).then(({result})=>{     
        const lyric = result.lrc?.lyric
        this.setData({
          lyric: lyric ? lyric : '暂无歌词'
        })
      })
    })
  },
  //暂停播放音乐
  pauseMusic(){
    const {isPlaying} = this.data
    isPlaying ? backgroundAudioManager.pause() : backgroundAudioManager.play()
    this.setData({
      isPlaying:!isPlaying
    })
  },
  //切换上一首
  onPrev(){
    nowPlayingIndex === 0 ? nowPlayingIndex = musicList.length-1 : nowPlayingIndex--
    this.loadMusicDetail(musicList[nowPlayingIndex].id)
  },
  //切换下一首
  onNext(){
    nowPlayingIndex === musicList.length-1 ? nowPlayingIndex = 0  : nowPlayingIndex++
    this.loadMusicDetail(musicList[nowPlayingIndex].id)
  },
  //显示歌词
  onChangeLyricShow(){
    this.setData({
      isShowLyric:!this.data.isShowLyric
    })
  },
  //当前播放的歌词
  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  //后台播放暂停
  musicPlay(){
    this.setData({
      isPlaying:true
    })
    app.setIsPause(false)
  },
  musicPause(){
    this.setData({
      isPlaying:false
    })
    app.setIsPause(true)
  },
  //保存播放历史
  getPlayHistory(){
    const music = musicList[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let bHave = false
    for(let i = 0; i < history.length; i++){
      if(history[i].id === music.id){
        bHave = true
        break
      }
    }
    if(!bHave){
      history.unshift(music)
      wx.setStorage({
        key:openid,
        data:history
      })
    }
  }
})