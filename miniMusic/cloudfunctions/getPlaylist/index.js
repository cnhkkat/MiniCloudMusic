/*
 * @Descripttion:
 * @version:
 * @Author: wutingting
 * @Date: 2022-02-11 11:54:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-23 22:36:38
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database()

const axios = require('axios')
const MAX_LIMIT = 150
const URL = `https://apis.imooc.com/personalized?limit=${MAX_LIMIT}&icode=C45CB728700C8355`
const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  const { total } = await playlistCollection.count()
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []

  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }

  let list = {
    data: [],
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((pre, next) => {
      return {
        data: pre.data.concat(next.data),
      }
    })
  }

  const { data } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0
  }
  const result = data.result
  let newData = []
  for (let i = 0; i < result.length; i++) {
    let flag = true
    for (let j = 0; j < list.data.length; j++) {
      if (result[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      let pl = result[i]
      pl.createTime = db.serverDate()
      newData.push(pl)
    }
  }
  console.log(newData)
  if (newData.length > 0) {
    await playlistCollection
      .add({
        data: newData,
      })
      .then(() => {
        console.log('插入成功')
      })
      .catch(() => {})
  }
  return newData.length
}
