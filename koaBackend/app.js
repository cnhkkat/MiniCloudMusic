/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-03 10:52:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-23 23:09:33
 */
const koa = require('koa')
const app = new koa()
const Router = require('koa-router')
const router = new Router()
//解析post请求体
const koaBody = require('koa-body')

const env = 'cloud2-6gole4sy6de8f571'

//跨域
const cors = require('koa2-cors')

app.use(
  cors({
    origin: ['http://localhost:9528'],
    credentials: true,
  })
)
// 接收post参数解析
app.use(
  koaBody({
    multipart: true,
  })
)

app.use(async (ctx, next) => {
  console.log('全局中间件')
  ctx.state.env = env
  await next()
})

//导入
const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')

router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())
router.use('/blog', blog.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
