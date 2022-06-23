// pages/musicList/components/musicList/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicList:Array
  },
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的初始数据
   */
  data: {
    musicId:''
  },
  pageLifetimes:{
    show(){
      this.setData({
        musicId:parseInt(app.getPlayMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectClick(event){
      const {musicId,index} = event.currentTarget.dataset
      this.setData({
        musicId
      })
      wx.navigateTo({
        url: `../../pages/player/index?musicId=${musicId}&index=${index}`,
      })
    }
  }
})
