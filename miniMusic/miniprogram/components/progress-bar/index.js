// components/progress-bar/index.js
let movableAreaWidth = 0 //进度条长度px
let movableViewWidth = 0 //小圆点px
let currentSec = 0 //当前s
let duration = 0 // s 总时长
let isMoving = false 
let backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime:{
      currentTime:'00:00',
      totalTime:'00:00'
    },
    movableDis:0, // 移动原点的距离 px
    progress:0 // % 
  },
  lifetimes:{
    ready(){
      if(this.data.isSame && this.data.showTime.totalTime == '00:00'){
        this.setTotalTime()
      }
      if(this.data.isSame && app.getIsPause()){
        // this.updateTime()
        const currentTime = backgroundAudioManager.currentTime;
        const currentTimeFmt = this.formatTime(currentTime)
        this.setData({
          movableDis:(movableAreaWidth-movableViewWidth) * currentTime / duration,
          progress:currentTime / duration * 100,
          ['showTime.currentTime']:`${currentTimeFmt.min}:${currentTimeFmt.sec}`
        })
      }
      this.getMovableDis(),
      this.bindMusicEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拖动进度条中
    onChange(event){
      if(event.detail.source === 'touch'){
        isMoving=true
        this.data.movableDis = event.detail.x 
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
      }
    },
    //拖动完成
    onTouchEnd(){
      const currentTimeFmt = this.formatTime(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        movableDis:this.data.movableDis,
        progress:this.data.progress,
        ['showTime.currentTime']:`${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
      backgroundAudioManager.seek(this.data.progress * duration / 100)
      isMoving=false
    },
    //获取进度条长度
    getMovableDis(){
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    //控制事件
    bindMusicEvent(){
      backgroundAudioManager.onPlay(()=>{
        isMoving=false
        this.triggerEvent('musicPlay')
      }),
      backgroundAudioManager.onPause(()=>{
        this.triggerEvent('musicPause')
      }),
      backgroundAudioManager.onCanplay(()=>{
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this.setTotalTime()
        } else {
          setTimeout(() => {
            this.setTotalTime()
          }, 1000)
        }
    }),
      backgroundAudioManager.onTimeUpdate(()=>{
          this.updateTime()
      }),
      backgroundAudioManager.onEnded(()=>{
        this.triggerEvent('musicEnd')
      })
    },
    updateTime(){
        const currentTime = backgroundAudioManager.currentTime;
        const currentTimeFmt = this.formatTime(currentTime)
        const sec = currentTime.toString().split('.')[0]
        if(sec != currentSec){
          this.setData({
            movableDis:(movableAreaWidth-movableViewWidth) * currentTime / duration,
            progress:currentTime / duration * 100,
            ['showTime.currentTime']:`${currentTimeFmt.min}:${currentTimeFmt.sec}`
          })
          currentSec = sec
          this.triggerEvent('timeUpdate',{
            currentTime
          })
        }
    },
    setTotalTime(){
        duration = backgroundAudioManager.duration
        const durationFmt = this.formatTime(duration)
        this.setData({
          ['showTime.totalTime']:`${durationFmt.min}:${durationFmt.sec}`
        })
    },
    formatTime(time){
      let min = Math.floor(time / 60)
      let sec = Math.floor(time % 60)
      return {
        min:this.fill0(min),
        sec:this.fill0(sec)
      }
    },
    fill0(min){
      return min < 10 ? '0'+ min : min
    },
  }
})