// pages/blogComment/index.js
import formatTime from '../../utils/formatTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog:{},
    commentList:[],
    blogId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId:options.blogId
    })
    this.getBlogDetail()
  },
  getBlogDetail(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    const { blogId } = this.data
    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId,
        $url:'detail'
      }
    }).then(({result})=>{
      const blog = result.list[0]
      let { commentList } = blog
      for (let i = 0, len = commentList.length; i < len; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }
    this.setData({
        commentList:commentList.reverse(),
        blog,
      })
      wx.hideLoading()
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { blog } = this.data
    return {
      title: blog.content,
      path: `/pages/blogComment/index?blogId=${blog._id}`,
    }
  }
})