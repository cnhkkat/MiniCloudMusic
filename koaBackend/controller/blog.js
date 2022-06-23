/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-07 23:17:26
 * @LastEditors: wutingting
 * @LastEditTime: 2022-03-08 11:20:13
 */
const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB.js')
const callCloudStorage = require('../utils/callCloudStorage.js')

router.get('/list', async (ctx) => {
  const params = ctx.request.query
  const query = `db.collection('blog').skip(${params.start}).limit(${params.count}).orderBy('createTime','desc').get()`
  const res = await callCloudDB(ctx, 'databasequery', query)

  ctx.body = {
    code: 20000,
    data: res.data,
  }
})

router.post('/del', async (ctx, next) => {
  const params = ctx.request.body
  //删除blog
  const queryBlog = `db.collection('blog').doc('${params._id}').remove()`
  const delBlogRes = await callCloudDB(ctx, 'databasedelete', queryBlog)
  //删除评论
  const queryComment = `db.collection('blog-comment').where({
    blogId:'${params._id}'
  }).remove()`
  const delCommentRes = await callCloudDB(ctx, 'databasedelete', queryComment)
  //删除云存储图片
  const delStorageRes = await callCloudStorage.delete(ctx, params.img)
  ctx.body = {
    data: {
      delBlogRes,
      delCommentRes,
      delStorageRes,
    },
    code: 20000,
  }
})

module.exports = router
