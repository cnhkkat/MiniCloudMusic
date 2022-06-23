// components/playlist/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    playlist: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusicList() {
      wx.navigateTo({
        url: `../../pages/musicList/index?playlistId=${this.data.playlist.id}`,
      })
    },
  }
})
