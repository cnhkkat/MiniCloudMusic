// components/login/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loginPopVisible:Boolean
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
    onGotUserInfo() {
      wx.getUserProfile({
        desc: '用于发布信息时获取头像与昵称',
        success: (res) => {
          console.log(res)
          this.setData({
            loginPopVisible: false
          })
          this.triggerEvent('loginSuccess', res.userInfo)
        },
        fail: (err) => {
          console.log(err)
          this.triggerEvent('loginFail')
        }
      })
    }
  }
})
