import { createAction } from 'redux-actions'
import socket from '../../socket'
import { _getAccountInfo } from '../../services/index'
import { toDecimal } from '../../utils/utilFunc'

export const INIT_SOCKET = 'INIT_SOCKET'
export const ADD_TO_KLINE = 'ADD_TO_KLINE'
export const DELETE_FROM_KLINE = 'DELETE_FROM_KLINE'
export const SET_ACCOUNTINFO = 'SET_ACCOUNTINFO'
export const GET_ACCOUNTINFO = 'GET_ACCOUNTINFO',
             GET_ACCOUNTINFO_PENDING = 'GET_ACCOUNTINFO_PENDING',
             GET_ACCOUNTINFO_FULFILLED = 'GET_ACCOUNTINFO_FULFILLED',
             GET_ACCOUNTINFO_REJECTED = 'GET_ACCOUNTINFO_REJECTED'

// 全局配置
// --- socket初始化
export const initSocket = createAction(
  INIT_SOCKET, () => {
    var ws = new socket("ws://47.113.231.12:5885/")
    ws.doOpen()
    return ws
  }
)
// --- 获取账户信息
export const getAccountInfo = createAction(GET_ACCOUNTINFO, () => {
  return _getAccountInfo().then(res => {
    const profit      = res.equity - res.balance - res.credit,  // 浮动盈亏
          equity      = res.equity,   // 净值
          balance     = res.balance,  // 余额
          freeMargin  = res.margin_free,      // 可用保证金
          marginLevel = equity - freeMargin ? Math.floor(equity / (equity - freeMargin) * 10000) / 100 : 0
    return {
      profit, equity, balance, freeMargin, marginLevel,
      margin: res.margin
    }
  })
})
// --- 设置账户信息
export const setAccountInfo = createAction(SET_ACCOUNTINFO, accoutInfo => accoutInfo)

// K线
// --- 添加指定货币对的K线
export const addToKLine = createAction(
  ADD_TO_KLINE, symbol => symbol
)
// --- 删除指定货币对的K线
export const deleteFromKLine = createAction(
  DELETE_FROM_KLINE, symbol => symbol
)