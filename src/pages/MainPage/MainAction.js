import axios from 'axios'
import { createAction } from 'redux-actions'
import socket from '../../socket'
import { 
  _getAccountInfo,
  _getPositions, 
  _getHistories, 
  _openOrder,
  _modifyOrder,
  _closeOrder,
  _getNewsData,
  _getCalendarData
} from '../../services/index'
import { 
  getCmdArr
} from '../../utils/utilFunc'
import * as actionTypes from './MainActionTypes'

// 全局
// --- socket
export const initSocket = createAction(actionTypes.INIT_SOCKET, () => {
    // var ws = new socket("ws://47.113.231.12:5885/")
    // var ws = new socket("ws://118.193.38.199")
    var ws = new socket("ws://156.226.24.38:61029")
    ws.doOpen()
    // console.log("ws", ws)
    ws.on("open", function () {
      console.log("ws sending...")
      ws.send({
        "cmd": "symbols",
        "args": [""]
      })
      ws.send({
        "cmd": "order",
        "args": "MTE5MjI6MTYxMDk1MDIyNzo3ZjI3NzYzYzIxZTFlYzU4NDBkYmYyNjk1ODZmYjRlNA=="
      })
    })
    return ws
  }
)
export const openOrder = createAction(actionTypes.OPEN_ORDER, params => {
  return _openOrder(params).then(response => {
    console.log(response)
  })
})

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

// 新闻版块
export const getNewsData = createAction(actionTypes.GET_NEWSDATA, params => {
  const { t } = params
  // const url = `https://www.jin10.com/flash_newest.js?t=${t}`
  // return new Promise((resolve, reject) => {
  //   window.getNewsData = ((res) => {
  //     console.log(res)
  //     resolve(res)
  //     document.getElementsByTagName('head')[0].removeChild(jsonp)
  //   })()
  //   const jsonp = document.createElement("script")
  //   jsonp.type = "text/javascript"
  //   jsonp.src = url
  //   document.getElementsByTagName("head")[0].appendChild(jsonp)
  // })  
  // return axios({
  //   url: 'https://www.jin10.com/flash_newest.js?t=1609839179540',
  //   method: 'get',
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': '*',
  //     'Access-Control-Allow-Methods': '*'
  //   },
  //   data: t
  //   // dataType: 'jsonp'
  // }).then(res => {
  //   console.log(res)
  // })
  return _getNewsData({t}).then(response => {
    console.log(response)
  })
})
// --- 财经日历
export const getCalendarData = createAction(actionTypes.GET_CALENDARDATA, params => {
  return _getCalendarData(params)
  // .then(response => {
  //   console.log("====response",response)
  // })
})

// 订单板块
// 获取持仓单&挂单
export const getPositions = createAction(actionTypes.GET_POSITIONS, () => {
  return _getPositions().then(response => {
    let position = [], order = []
    try {
      for(var p of response) {
        if(Number(p.cmd) < 2) {  // 持仓单
          position.push(p)
        } else {  // 挂单
          order.push(p)
        }
      }
    } catch (error) {
      console.log("====error",error)
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
    try {
      for(var p of response) {
        p.cmdForCh = getCmdArr()[p.cmd]
      }
      return response
    } catch (error) {
      return []
    }
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