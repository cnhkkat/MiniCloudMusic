// components/lyric/index.js
let lyricHeight = 32
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowLyric:{
      type:Boolean,
      value:false
    },
    lyric:{
      type:String,
      value:''
    }
  },
  observers: {
    lyric(lrc){
      if (lrc == '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc,
            time: 0,
          }],
          nowLyricIndex: -1
        })
      } else {
        this.parseLyric(lrc)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList:[],
    nowLyricIndex:0,
    scrollTop:0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime){
      let { lrcList } = this.data
      if(lrcList.length === 0) return
      if (currentTime >= lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: lrcList.length - 1,
            scrollTop: lrcList.length * lyricHeight 
          })
        }
      }
      for(let i=0;i<lrcList.length;i++){
        if(currentTime < lrcList[i].time){
          this.setData({
            nowLyricIndex:i-1 ,
            scrollTop: (i-1) * lyricHeight
          })
          break
        }
      }
    },
    parseLyric(sLyric){
      let line = sLyric.split('\n')
      let _lrcList=[]
      line.forEach(e=>{
       let time =  e.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g) //  ["[00:00.000]"]
       if(time != null){
         let lrc = e.split(time)[1]
         let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)  // [00:00.000] match 分段
         let time2sec = parseInt(timeReg[1]) * 60 +  parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000 
         _lrcList.push({
           lrc,
           time:time2sec
         })
       }
       this.setData({
         lrcList:_lrcList
       })
      })
    }
  }
})
