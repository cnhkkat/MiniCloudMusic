// pages/blogHistory/index.js
//云函数访问数据库
const MAX_LIMIT = 10
//小程序端访问数据库
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[],
    isLoading:false,
    endPage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getBlogList()
    this.getListByMini()
  },
  getBlogList(){
    wx.showLoading({
      title:'加载中',
      icon:'none'
    })
    this.setData({isLoading:true})
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'getListByOpenid',
        start:this.data.blogList.length,
        count:MAX_LIMIT
      }
    }).then(res=>{
      const { blogList } = this.data
      this.setData({
        blogList: blogList.concat(res.result),
        endPage: Boolean(res.result.length < MAX_LIMIT),
        isLoading: false
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch(err=>{
      wx.hideLoading()
    })
  },
  onComment(e){
    const { blogId } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/blogComment/index?blogId=${blogId}`,
    })
  },
  

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList:[],
      endPage:false,
      isLoading:true
    })
    this.getListByMini()
    // this.getBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { endPage } = this.data
    // endPage || this.getBlogList()
    endPage ||  this.getListByMini()
  },

  getListByMini(){
    wx.showLoading({
      title:'加载中',
      icon:'none'
    })
    db.collection('blog')
    .skip(this.data.blogList.length).limit(MAX_LIMIT).orderBy('createTime','desc')
    .get().then(res=>{
      let _blogList = res.data
      _blogList.map(e => {
        return e.createTime =  e.createTime.toString()
      });
      const { blogList } = this.data
      this.setData({
        blogList:blogList.concat(_blogList),
        endPage: Boolean(res.data.length < MAX_LIMIT),
        isLoading: false
      })
      wx.hideLoading()
    })
  },
  onShareAppMessage: function (e) {
    console.log(e);
    const { blog } = e.target.dataset
    return {
    	title: blog.content,
      path: `/pages/blogComment/blogComment?blogId=${blog._id}`,
     }
  },
})