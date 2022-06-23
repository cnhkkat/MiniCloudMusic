// pages/playlist/index.js
const MAX_LIMIT = 15;
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [
      // {
      //   url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      // },
      // {
      //   url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      // },
      // {
      //   url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      // },
    ],
    playlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getPlaylist()
   this.getSwiper()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      playlist:[]
    })
    this.getPlaylist()
    this.getSwiper()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {endPage} = this.data
    endPage || this.getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  //获取歌单数据
  getPlaylist(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        start:this.data.playlist.length,
        count:MAX_LIMIT,
        $url:'playlist'
      }
    }).then((res)=>{
      console.log(res);
      const { playlist } = this.data;
      const {result} = res
      this.setData({
        playlist:playlist.concat(result.data),
        endPage: Boolean(result.data?.length < MAX_LIMIT || 0)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  getSwiper(){
    db.collection('swiper').get().then(res=>{
      const { data } = res
      this.setData({
        swiperImgUrls:data
      })
    })
  }
});
