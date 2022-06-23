// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  try { 
    const wxContext = cloud.getWXContext()
    return await cloud.openapi.subscribeMessage.send({
      touser:wxContext.OPENID,
      templateId:'s3geRZpF-uO7ppz6wbOeiNBjrjrKxigwe9Ld1IDfp0Q',
      page:`pages/blogComment/index?blogId=${event.blogId}`,
      data:{
        thing2:{
          value:event.content
        },
        thing3:{
          value:event.nickname
        },
        time4:{
          value:event.commentTime
        },
        thing1:{
          value:event.blog
        }
      },
      miniprogramState:'developer'
  })
  } catch (error) {
    console.log(error);
  }

}