import { createAction } from 'redux-actions'
import socket from '../../socket'
import { 
  _getAccountInfo,
  _getPositions, 
  _getHistories, 
  _modifyOrder,
  _closeOrder
} from '../../services/index'
import { 
  getCmdArr
} from '../../utils/utilFunc'
import * as actionTypes from './MainActionTypes'

// 全局
// --- socket
export const initSocket = createAction(actionTypes.INIT_SOCKET, () => {
    // var ws = new socket("ws://47.113.231.12:5885/")
    var ws = new socket("ws://118.193.38.199")
    ws.doOpen()
    return ws
  }
)

// --- 报价板块
// ----- 存储货币对（来源：websocket）
export const getSymbols = createAction(actionTypes.GET_SYMBOLS, payload => payload)
export const setSymbols = createAction(actionTypes.SET_SYMBOLS, payload => payload)
// 选择显示哪一类报价列表
export const setSymbolGroup = createAction(actionTypes.SET_SYMBOL_GROUP, payload => payload)

// K线板块
// --- 添加指定货币对的K线
export const addToKLine = createAction(actionTypes.ADD_TO_KLINE, symbol => symbol)
// --- 删除指定货币对的K线
export const deleteFromKLine = createAction(actionTypes.DELETE_FROM_KLINE, symbol => symbol)

// 订单板块
// 获取持仓单&挂单
export const getPositions = createAction(actionTypes.GET_POSITIONS, () => {
  return _getPositions().then(response => {
    let position = [], order = []
    for(var p of response) {
      if(Number(p.cmd) < 2) {  // 持仓单
        position.push(p)
      } else {  // 挂单
        order.push(p)
      }
    }
    return {
      position: position,
      order: order
    }
  })
})
// 获取指定时间段的历史订单（默认为全部）
export const getHistories = createAction(actionTypes.GET_HISTORIES, params => {
  return _getHistories(params).then(response => {
    for(var p of response) {
      p.cmdForCh = getCmdArr()[p.cmd]
    }
    return response
  })
})
// 修改订单止盈止损
export const modifyOrder = createAction(actionTypes.MODIFY_ORDER, params => {
  const { activeKey, ...axiosParams } = params
  return _modifyOrder(axiosParams).then(response => {
    if(response.code) {
      return params
    }
  })
})
// 平仓/删除挂单
export const closeOrder = createAction(actionTypes.CLOSE_ORDER, params => {
  const { activeKey, ...axiosParams } = params
  return _closeOrder(axiosParams).then(response => {
    return { ticket: (axiosParams.ticket + "").split(","), activeKey }
  })
})

// 账户板块
// --- 获取账户信息
export const getAccountInfo = createAction(actionTypes.GET_ACCOUNTINFO, () => {
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
export const setAccountInfo = createAction(actionTypes.SET_ACCOUNTINFO, info => info)