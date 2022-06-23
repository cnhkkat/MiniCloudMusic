/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-03-03 18:38:10
 * @LastEditors: wutingting
 * @LastEditTime: 2022-03-03 18:44:55
 */

const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')

const callCloudFn = async (ctx, fnName, params) => {
  const access_token = await getAccessToken()
  const options = {
    method: 'POST',
    uri: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ctx.state.env}&name=${fnName}`,
    body: {
      ...params,
    },
    json: true,
  }

  return await rp(options)
    .then((res) => {
      return res
    })
    .catch((err) => {})
}

module.exports = callCloudFn
