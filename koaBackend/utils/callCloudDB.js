/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-04 19:12:15
 * @LastEditors: wutingting
 * @LastEditTime: 2022-03-04 19:26:24
 */
const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')

const callCloudDB = async (ctx, fnName, query = {}) => {
  const access_token = await getAccessToken()
  const options = {
    method: 'POST',
    uri: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${access_token}`,
    body: {
      query,
      env: ctx.state.env,
    },
    json: true,
  }
  return await rp(options)
    .then((res) => res)
    .catch((err) => console.log(err))
}

module.exports = callCloudDB
