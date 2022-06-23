/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-03 11:02:19
 * @LastEditors: wutingting
 * @LastEditTime: 2022-03-03 16:48:28
 */
const rp = require('request-promise')
const APPID = 'wx12da8a96bf6aaaa2'
const APPSECRET = 'b7d39e20ec6e60d4f75a4a2e1905fba2'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')
const updateAccessToken = async () => {
  const resStr = await rp(URL)
  const res = JSON.parse(resStr)
  if (res.access_token) {
    fs.writeFileSync(
      fileName,
      JSON.stringify({
        access_token: res.access_token,
        createTime: new Date(),
      })
    )
  } else {
    await updateAccessToken()
  }
}

const getAccessToken = async () => {
  try {
    const readRes = fs.readFileSync(fileName, 'utf8')
    const readObj = JSON.parse(readRes)

    const createTime = new Date(readObj.createTime).getTime()
    const nowTime = new Date().getTime()
    if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
      await updateAccessToken()
      await getAccessToken()
    }
    return readObj.access_token
  } catch (error) {
    await updateAccessToken()
    await getAccessToken()
  }
}

setInterval(async () => {
  await updateAccessToken()
}, (7200 - 300) * 1000)

module.exports = getAccessToken
