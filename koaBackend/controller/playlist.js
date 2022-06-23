/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-03 15:48:50
 * @LastEditors: wutingting
 * @LastEditTime: 2022-03-04 22:32:48
 */
const Router = require('koa-router')
const router = new Router()

const callCloudFn = require('../utils/callCloudFn.js')
const callCloudDB = require('../utils/callCloudDB.js')

//查询歌单列表
router.get('/list', async (ctx, next) => {
  const query = ctx.request.query
  // console.log(query)
  const res = await callCloudFn(ctx, 'music', {
    $url: 'playlist',
    start: parseInt(query.start),
    count: parseInt(query.count),
  })
  let data = []
  if (res.resp_data) {
    data = JSON.parse(res.resp_data).data
  }
  ctx.body = {
    data,
    code: 20000,
  }
})

//根据ID查询数据库歌曲信息
router.get('/getById', async (ctx, next) => {
  const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
  const res = await callCloudDB(ctx, 'databasequery', query)
  console.log(res)
  ctx.body = {
    data: JSON.parse(res.data),
    code: 20000,
  }
})

//编辑更新数据库
router.post('/updatePlaylist', async (ctx, next) => {
  const params = ctx.request.body
  const query = `
    db.collection('playlist').doc('${params._id}').update({
      data:{
        name:'${params.name}',
        copywriter:'${params.copywriter}',

      }
    })
  `
  const res = await callCloudDB(ctx, 'databaseupdate', query)
  ctx.body = {
    data: res,
    code: 20000,
  }
})

//删除更新数据库
router.get('/del', async (ctx, next) => {
  const params = ctx.request.query
  console.log(params)
  const query = `db.collection('playlist').doc('${params.id}').remove()`
  const res = await callCloudDB(ctx, 'databasedelete', query)
  ctx.body = {
    data: res,
    code: 20000,
  }
})

module.exports = router
