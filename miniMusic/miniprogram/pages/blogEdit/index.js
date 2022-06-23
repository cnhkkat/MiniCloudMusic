// pages/blogEdit/index.js
//最多输入文字
const MAX_WORDS_NUM = 140
//最大上传图片数
const MAX_IMG_NUM = 9
//博客内容
let content = ''
let db = wx.cloud.database()
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum:0,
    footerBottom:0,
    images:[],
    selectPhoto:true,
  },
  onLoad(options){
    userInfo = options
  },
  onInput(e){
    const {value} = e.detail
    
    let wordsNum = value.length
    if(wordsNum >= MAX_WORDS_NUM){
      wordsNum = `最大输入${MAX_WORDS_NUM}字符`
    }
    this.setData({
      wordsNum
    })

    content=value
  },
  onFocus(e){
    this.setData({
      footerBottom:e.detail.height + 46
    })
  },
  onBlur(e){
    this.setData({
      footerBottom:0
    })
  },
  onChooseImage(){
    const { images } = this.data
    //限制总共只能选9张
    let max = MAX_IMG_NUM - images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=> {
        this.setData({
          images:images.concat(res.tempFilePaths),
        })
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <=0 ? false : true
        })
      }
    })
  },
  onDelImage(e){
    const {index} = e.currentTarget.dataset
    this.data.images.splice(index,1)
    this.setData({
      images:this.data.images
    })
    if(this.data.images.length < MAX_IMG_NUM){
      this.setData({
        selectPhoto:true
      })
    }
  },
  onPreviewImage(e){
    console.log(e);
    const {images} = this.data
    const {imgsrc} = e.currentTarget.dataset
    wx.previewImage({
      urls: images,
      current:imgsrc
    })
  },
  send(){
    if(content.trim() === ''){
      wx.showToast({
        title: '内容不能为空',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask:true
    })
    
    //上传到云存储
    const {images} = this.data
    let promiseArr = []
    let fileIds = []
    // images.forEach(item =>{
      for(let i = 0 ; i < images.length ; i++){
      let p = new Promise((resolve,reject)=>{
        let suffix = /\.\w+$/.exec(images[i])[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + suffix,
          // filePath:item,
          filePath:images[i],
          success: (res)=>{
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err)=>{
            reject()
          }
        })
      })
      promiseArr.push(p)
    // })
      }
    
    // 上传到数据库
    Promise.all(promiseArr).then(res=>{
      db.collection('blog').add({
        data:{
            ...userInfo,
            content,
            img:fileIds,
            createTime:db.serverDate()
        }
      }).then(res=>{
        wx.hideLoading()
        content=''
        wx.showToast({
          title: '发布成功',
          icon:'none'
        })
        wx.navigateBack()
      })
    }).catch(err=>{
      wx.hideLoading({})
      wx.showToast({
        title: '发布失败',
        icon:'none'
      })
    })
  }
})