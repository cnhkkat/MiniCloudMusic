// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const axios = require('axios')

const BASE_URL = 'https://apis.imooc.com'
const ICODE = 'icode=C45CB728700C8355'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  //歌单列表
  app.router('playlist', async (ctx, next) => {
    ctx.body = cloud
      .database()
      .collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => res)
  })

  //歌单里的音乐列表
  app.router('musicList', async (ctx, next) => {
    let res = await axios.get(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}&${ICODE}`)
    ctx.body = res.data
    console.log(res)
  })

  //歌曲信息
  app.router('musicUrl', async (ctx, next) => {
    let res = await axios.get(`${BASE_URL}/song/url?id=${parseInt(event.musicId)}&${ICODE}`)
    ctx.body = res.data
    console.log(res)
  })

  //歌词
  app.router('lyric', async (ctx, next) => {
    let res = await axios.get(`${BASE_URL}/lyric?id=${parseInt(event.musicId)}&${ICODE}`)
    ctx.body = res.data
    console.log(res)
  })
  return app.serve()
}
