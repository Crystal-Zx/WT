import http from '../http.js'
import apis from '../api.js'

// 登录
export function _login (params = {}) {
  return http.post(apis.login, params)
}
// MainPage
// --- 获取账户信息
export function _getAccountInfo (params = {}) {
  return http.post(apis.getAccountInfo, params)
}
// --- 获取报价货币对
export function _getSymbols (params = {}) {
  return http.post(apis.getSymbols, params)
}
// --- 获取持仓单
export function _getPositions (params = {}) {
  return http.post(apis.getPositions, params)
}
// --- 获取历史订单
export function _getHistories (params = {}) {
  return http.post(apis.getHistories, params)
}
// --- 修改订单止盈、止损
export function _modifyOrder (params = {}) {
  return http.post(apis.modifyOrder, params)
}