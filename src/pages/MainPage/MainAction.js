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
  _getEcoData,
  _getEcoEvent,
  _getEcoCharts,
  _getEcoDesc,
  _login,
  _loginOA1,
  _loginOA2,
  _getDate,
  _getSymbolInfo
} from '../../services/index'
import { 
  getCmdArr
} from '../../utils/utilFunc'
import user from '../../services/user'
import * as actionTypes from './MainActionTypes'

// 全局
// ---WT登录
export const login = createAction(actionTypes.LOGIN, params => {
  return _login(params)
  // .then(response => Object.assign({}, response, {
  //   account: params.login
  // }))
})
// --- OA假登陆1：输入OA合法的token
export const loginOA1 = createAction(actionTypes.LOGIN_OA1, params => {
  return _loginOA1(params)
})
// --- OA假登陆2：输入账号和密码
export const loginOA2 = createAction(actionTypes.LOGIN_OA2, params => {
  return _loginOA2(params)
})
// --- 修改当前是否停盘
export const isSuspension = createAction(actionTypes.IS_SUSPENSION, () => {
  return _getDate().then(res => {
    const value = res
    // mock data
    // const value = { Unix: 1613233200, datetime: '2021-02-14 00:20:00', weekday: 0 }
    const oneDayTime = 24 * 60 * 60 * 1000,  // ms
          datetime = value.datetime.replace(/-/g, '/'),
          curdate1 = new Date(datetime.substr(0, 10) + ' 00:06:00').getTime(),
          curdate2 = new Date(datetime.substr(0, 10) + ' 00:05:00').getTime(),
          MondayTime = curdate1 - (value.weekday - 1) * oneDayTime,
          SaturdayTime = curdate2 + (6 - value.weekday) * oneDayTime;
          
    if (value.Unix * 1000 > MondayTime && value.Unix * 1000 < SaturdayTime) {
      // console.log("交易时间")
      return false
    } else {
      // console.log("非交易时间")
      return true
    }
  })
})
// export const setCurrAcc = createAction(actionTypes.SET_CURRACC, params => params)
// --- socket
export const initSocket = createAction(actionTypes.INIT_SOCKET, () => {
    var ws = new socket(user.getWSUrl())
    ws.doOpen()
    ws.on("open", function () {
      ws.send({
        "cmd": "symbols",
        "args": [""]
      })
      user.getToken() && ws.send({
        "cmd": "order",
        "args": [`${user.getToken()}`]
      })
    })
    return ws
  }
)
export const openOrder = createAction(actionTypes.OPEN_ORDER, params => {
  return _openOrder(params)
})
// --- 主题设置（本不必存store，在此是为了统一tradingview的主题）
export const setTheme = createAction(actionTypes.SET_THEME, params => params)

// --- 报价板块
// ----- 存储货币对（来源：websocket）
export const getSymbols = createAction(actionTypes.GET_SYMBOLS, payload => payload)
export const setSymbols = createAction(actionTypes.SET_SYMBOLS, payload => payload)
// 选择显示哪一类报价列表
export const setSymbolGroup = createAction(actionTypes.SET_SYMBOL_GROUP, payload => payload)
export const getSymbolInfo = createAction(actionTypes.GET_SYMBOLINFO, payload => {
  // console.log(payload)
  return _getSymbolInfo(payload)
})

// K线板块
// --- 添加指定货币对的K线
export const addToKLine = createAction(actionTypes.ADD_TO_KLINE, symbol => {
  // const _kline = JSON.parse(localStorage.getItem("wt_kline")) || []
  // localStorage.setItem("wt_kline", JSON.stringify(_kline.concat([symbol])))
  return symbol
})
// --- 删除指定货币对的K线
// symbol: symbolName
export const deleteFromKLine = createAction(actionTypes.DELETE_FROM_KLINE, symbol => {
  return symbol
})

// 新闻版块
export const getNewsData = createAction(actionTypes.GET_NEWSDATA, params => {
  const { t } = params
  return _getNewsData({t})
})
// --- 财经日历
export const getCalendarData = createAction(actionTypes.GET_CALENDARDATA, params => {
  return Promise.all([_getEcoData(params), _getEcoEvent(params)])
})
// ---- 财经日历 详情
export const getEcoDetail = createAction(actionTypes.GET_ECODETAIL, params => {
  return Promise.all([_getEcoCharts(params), _getEcoDesc(params)])
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