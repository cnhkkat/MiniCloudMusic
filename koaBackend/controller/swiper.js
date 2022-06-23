/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-06 14:51:05
 * @LastEditors: wutingting
 * @LastEditTime: 2022-03-08 11:20:31
 */

const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB.js')
const callCloudStorage = require('../utils/callCloudStorage.js')

router.get('/list', async (ctx, next) => {
  //小程序端从云数据库获取数据默认一次是20条，云函数从云数据库获取数据默认一次是100条
  // HTTP API从云数据库获取数据，默认是10条
  const query = `db.collection('swiper').get()`
  const res = await callCloudDB(ctx, 'databasequery', query)
  // console.log('数据库query', res)
  //文件下载链接
  let fileList = []
  const { data } = res
  for (let i = 0; i < data.length; i++) {
    fileList.push({
      fileid: JSON.parse(data[i]).fileid,
      max_age: 7200,
    })
  }
  const dlRes = await callCloudStorage.download(ctx, fileList)
  const file_list = dlRes.file_list || []
  let returnData = []
  for (let i = 0; i < file_list.length; i++) {
    returnData.push({
      download_url: file_list[i].download_url,
      fileid: file_list[i].fileid,
      _id: JSON.parse(data[i])._id,
    })
  }
  ctx.body = {
    code: 20000,
    data: returnData,
  }
})
router.post('/upload', async (ctx) => {
  const fileid = await callCloudStorage.upload(ctx)
  // console.log('fileid', fileid)
  //插入数据库
  const query = `
    db.collection('swiper').add({
      data:{
        fileid:'${fileid}'
      }
    })
  `
  const res = await callCloudDB(ctx, 'databaseadd', query)
  // console.log('databaseadd-res', res)
  ctx.body = {
    code: 20000,
    id_list: res.id_list,
  }
})

router.get('/del', async (ctx) => {
  const params = ctx.request.query
  //删除云数据库
  const query = `db.collection('swiper').doc('${params._id}').remove()`
  const delDBRes = await callCloudDB(ctx, 'databasedelete', query)
  //删除云存储中的文件
  const delStorageRes = await callCloudStorage.delete(ctx, [params.fileid])
  ctx.body = {
    code: 20000,
    data: {
      delDBRes,
      delStorageRes,
    },
  }
})
module.exports = router
