import http from '../http.js'
import apis from '../api.js'

// 登录
export function _login (params = {}) {
  return http.post(apis.login, params)
}
// 账户信息
// --- 获取账户信息
export function _getAccountInfo (params = {}) {
  return http.post(apis.getAccountInfo, params)
}
// 报价板块
// --- 获取报价货币对
export function _getSymbols (params = {}) {
  return http.post(apis.getSymbols, params)
}
// 订单板块
// --- 获取持仓单
export function _getPositions (params = {}) {
  return http.post(apis.getPositions, params)
}
// --- 获取历史订单
export function _getHistories (params = {}) {
  return http.post(apis.getHistories, params)
}
// 交易
// --- 下单
export function _openOrder (params = {}) {
  return http.post(apis.openOrder, params)
}
// --- 修改订单止盈、止损
export function _modifyOrder (params = {}) {
  return http.post(apis.modifyOrder, params)
}
// --- 平仓/删除挂单
export function _closeOrder (params = {}) {
  return http.post(apis.closeOrder, params)
}
// 新闻
// --- 获取新闻数据（金十）
export function _getNewsData (params = {}) {
  return http.get(apis.getNewsData, params)
}