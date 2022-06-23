// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud2-6gole4sy6de8f571',
        traceUser: true,
      });
    }
    this.checkUpdate()
    this.getOpenid()
    this.globalData = {
      musicId : 0,
      isPause : false, // 暂停后返回到列表
      openid: 0
    };
  },
  setPlayMusicId(musicId){
    this.globalData.musicId = musicId
  },
  getPlayMusicId(){
    return this.globalData.musicId
  },
  setIsPause(boolean){
    this.globalData.isPause = boolean
  },
  getIsPause(){
    return this.globalData.isPause
  },
  getOpenid(){
    wx.cloud.callFunction({
      name:'login'
    }).then(res=>{
      const openid = res.result.openid
      this.globalData.openid = openid
      if(wx.getStorageSync(openid) == ''){
        wx.setStorageSync(openid, [])
      }
    })
  },
  checkUpdate(){
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if(res.hasUpdate){
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showToast({
              title: '更新失败',
              icon: 'none',
            });
          })
        } 
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '您的微信版本过低，可能会影响小程序部分功能的使用，建议您先升级您的微信！',
        showCancel: false,
        confirmText: '关闭',
      });
    }
  }
});
