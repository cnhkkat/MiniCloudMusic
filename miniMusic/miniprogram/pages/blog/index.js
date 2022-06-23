/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-02-09 21:35:51
 * @LastEditors: wutingting
 * @LastEditTime: 2022-02-11 11:30:03
 */
// pages/blog/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    loginPopVisible:false,
    blogList:[],
    endPage:false,
    isLoading: false,
    keyword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow: function (options) {
    this.setData({
      blogList:[],
      isLoading:true
    })
    this.loadBlogList()
  },
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList:[],
      isLoading:true,
      endPage:false,
    })
    this.loadBlogList()
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {endPage} = this.data
    endPage || this.loadBlogList()
  },
/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const { blog } = e.target.dataset
    return {
      title: blog.content,
      path: `/pages/blogComment/index?blogId=${blog._id}`,
    }
  },
  loadBlogList(){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({ isLoading: true });
    const { keyword } = this.data
    wx.cloud.callFunction({
      name:'blog',
      data:{
        keyword,
        start:this.data.blogList.length,
        count:10,
        $url:'list'
      }
    }).then(res=>{
      const { blogList } = this.data
      this.setData({
        blogList:blogList.concat(res.result),
        endPage: Boolean(res.result.length < 10),
        isLoading:false
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch(err=>{
      wx.hideLoading()
    })
  },

  //点击发布
  onPublish(){
    this.setData({
      loginPopVisible:true
    })
  },
  //授权成功
  onLoginSuccess(e){
    const {detail} = e
    wx.navigateTo({
      url: `../blogEdit/index?nickname=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  //授权失败
  onLoginFail(){
    wx.showModal({
      title:'授权用户才能发布喔~'
    })
  },
  //跳转详情页
  goToComment(e){
    const {blogId} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../../pages/blogComment/index?blogId=${blogId}`,
    })
  },
  //搜索
  onSearch(e){
    const { keyword } = this.data
    if(keyword.trim() == ''){
      wx.showToast({
        title: '请输入关键字',
        icon:'none'
      })
      return
    }
    this.setData({
      blogList:[]
    })
   this.loadBlogList()
  },
  onClear(){
    this.setData({
      blogList:[]
    })
   this.loadBlogList()
  }
});
