import http from '../http.js'
import apis from '../api.js'

const fetchPost = (url, params, options) => {
  return new Promise((resolve, reject) => {
    http.post(url, params, options)
    .then(
      res => {
        // console.log("fetchPost then res:", res)
        resolve(res)
      }
      // err => {
      //   console.log("fetchPost then err:", err)
      //   reject(err)
      // }
    ).catch(err => {
      // console.log("fetchPost catch err:", err)
      reject(err)
    })
  })
}
const fetchGet = (url, params, options) => {
  return new Promise((resolve, reject) => {
    http.get(url, params, options)
    .then(
      res => { 
        // console.log('fetch get res:', res); 
        resolve(res)},
      err => reject(err)
    ).catch(err => {
      // console.log("fetchPost err:",err)
      reject(err)
    })
  })
}

// 登录
export function _login (params = {}) {
  return fetchPost(apis.login, params)
}
// 登录OA
// export function _loginOA (params = {}) {
//   return fetchPost(apis.loginOA, params)
// }
// OA 账号密码 换 WT账号信息
export function _loginOA2 (params = {}) {
  return fetchPost(apis.loginOA2, params)
}
// 账户信息
// --- 获取账户信息
export function _getAccountInfo (params = {}) {
  return fetchPost(apis.getAccountInfo, params)
  // return http.post(apis.getAccountInfo, params)
}
// 报价板块
// --- 获取报价货币对
export function _getSymbols (params = {}) {
  return fetchPost(apis.getSymbols, params)
}
// 订单板块
// --- 获取持仓单
export function _getPositions (params = {}) {
  return fetchPost(apis.getPositions, params)
}
// --- 获取历史订单
export function _getHistories (params = {}) {
  return fetchPost(apis.getHistories, params)
}
// 交易
// --- 下单
export function _openOrder (params = {}) {
  return fetchPost(apis.openOrder, params)
}
// --- 修改订单止盈、止损
export function _modifyOrder (params = {}) {
  return fetchPost(apis.modifyOrder, params)
}
// --- 平仓/删除挂单
export function _closeOrder (params = {}) {
  return fetchPost(apis.closeOrder, params)
}
// 新闻
// --- 获取新闻数据（金十）
export function _getNewsData (params = {}) {
  return http.get(apis.getNewsData, params)
}
// --- 财经日历
export function _getEcoData (params = {}) {
  const { year, date, timestamp } = params
  return fetchGet(
    `https://cdn-rili.jin10.com/data/${year}/${date}/economics.json?_=${timestamp}`
  )
}
export function _getEcoEvent (params = {}) {
  const { year, date, timestamp } = params
  return fetchGet(
    `https://cdn-rili.jin10.com/data/${year}/${date}/event.json?_=${timestamp}`
  )
}
export function _getEcoCharts (params = {}) {
  const { id } = params
  return fetchGet(
    `https://v1.alphazone-data.cn/academy/api/v1/calendarDetail/${id}`
  )
}
export function _getEcoDesc (params = {}) {
  const { id } = params
  return fetchGet(
    `https://cdn-rili.jin10.com/data/jiedu/${id}.json`
  )
}