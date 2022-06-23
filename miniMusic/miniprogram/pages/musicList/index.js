// pages/musicList/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicList:[],
    listInfo:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        playlistId:options.playlistId,
        $url:'musicList'
      }
    }).then(({result:{playlist}})=>{
      console.log(playlist);
      this.setData({
        musicList:playlist.tracks,
        listInfo:{
          coverImgUrl:playlist.coverImgUrl,
          name:playlist.name
        }
      })
      wx.setStorageSync('musicList', this.data.musicList)
      wx.hideLoading()
    })
  },
})