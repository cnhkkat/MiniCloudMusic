/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-07 09:31:58
 * @LastEditors: wutingting
 * @LastEditTime: 2022-03-07 22:20:27
 */
const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')

const fs = require('fs')

const cloudStorage = {
  async download(ctx, fileList) {
    const access_token = await getAccessToken()
    const options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${access_token}`,
      body: {
        env: ctx.state.env,
        file_list: fileList,
      },
      json: true,
    }

    return await rp(options)
      .then((res) => {
        return res
      })
      .catch((err) => {})
  },
  async upload(ctx) {
    //请求地址
    // console.log('upload-ctx', ctx)
    const access_token = await getAccessToken()
    //请求头
    const file = ctx.request.files.file
    const path = `swiper/${Date.now()}-${file.name}`
    const options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,
      body: {
        env: ctx.state.env,
        path,
      },
      json: true,
    }
    const info = await rp(options)
      .then((res) => {
        return res
      })
      .catch((err) => {})
    // console.log('info', info)
    // 上传图片
    const params = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
      },
      uri: info.url,
      formData: {
        key: path,
        Signature: info.authorization,
        'x-cos-security-token': info.token,
        'x-cos-meta-fileid': info.cos_file_id,
        file: fs.createReadStream(file.path),
      },
      json: true,
    }
    //没有返回值
    await rp(params)

    return info.file_id
  },
  async delete(ctx, fileid_list) {
    const access_token = await getAccessToken()
    const options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${access_token}`,
      body: {
        env: ctx.state.env,
        fileid_list: fileid_list,
      },
      json: true,
    }

    return await rp(options)
      .then((res) => {
        return res
      })
      .catch((err) => {})
  },
}
module.exports = cloudStorage
