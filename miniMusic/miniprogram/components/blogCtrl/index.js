// components/blogCtrl/index.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   blogId:{
     type:String,
     value:''
   },
   blog: Object,
  },
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的初始数据
   */
  data: {
    loginPopVisible: false,
    commentPopVisible:false,
    content:'',
    commentTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e){
      this.setData({
        content:e.detail.value
      })
    },
    //订阅消息
    subscribeMsg(){
      const tmplId = 's3geRZpF-uO7ppz6wbOeiNBjrjrKxigwe9Ld1IDfp0Q'
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success:(res)=> { 
          if(res[tmplId] === 'accept'){
            this.onComment()
          }else {
            wx.showToast({
              title:'订阅失败，无法评论',
              icon:'none'
            })
          }
        }
      })
    },
    onComment(){
      this.setData({
        loginPopVisible:true,
      })
    },
    onLoginSuccess(e){
      userInfo = e.detail
      this.setData({
        commentPopVisible:true
      })
    },
    onLoginFail(){
      wx.showModal({
        title: '授权用户才能进行评价噢~',
        icon: 'none',
      })
    },
    send(){
      const {content,blogId,blog} = this.data
      if(content.trim() == ''){
        wx.showModal({
          title:'请输入内容',
          icon:'none'
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask:true
      })
     
      db.collection('blog-comment').add({
        data:{
          blogId,
          content,
          createTime:db.serverDate(),
          nickName:userInfo.nickName,
          avatarUrl:userInfo.avatarUrl
        }
      }).then((res)=>{
        db.collection('blog-comment').where({
          blogId
        }).orderBy('createTime','desc').get().then(res=>{
          this.setData({
            commentTime:this._fmtSubscribeTime(res.data[0].createTime)
          })
          //发送订阅消息
          wx.cloud.callFunction({
          name:'subscribeMsg',
          data:{
            content,
            blogId,
            nickname:blog.nickname,
            blog:blog.content,
            commentTime:this.data.commentTime
          }
        }).then(res=>{
          console.log(res);
        })
        })
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          commentPopVisible:false,
          content:''
        })
        this.triggerEvent('refreshCommentList')
        wx.hideLoading()
      })
      .catch(err=>{
        wx.hideLoading({})
        wx.showToast({
          title: '评论失败',
          icon:'none'
        })
      })
    },
    //订阅消息里的时间格式化
    _fmtSubscribeTime(time_t){
      let date = time_t.getFullYear() + '年' + time_t.getMonth() + '月' + time_t.getDate() + '日' 
      let time = time_t.getHours() + ':' +  time_t.getMinutes()
      return date + ' ' + time
    }
  }
})
