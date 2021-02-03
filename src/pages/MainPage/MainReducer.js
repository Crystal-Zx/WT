import { combineReducers } from 'redux'
import * as actionTypes from './MainActionTypes'

// mock数据
// import {
//   plist, olist
// } from '../../services/mock'

// 全局
const currAcc = (
  state = sessionStorage.getItem("wt_currAcc"),
  action
) => {
  const { type, payload } = action
  switch(type) {
    case actionTypes.SET_CURRACC : {
      return payload
    }
    default: return state
  }
}
const initSocket = (state = {}, action) => {
  const { type, payload } = action
  // console.log(payload)
  switch(type) {
    case actionTypes.INIT_SOCKET: {
      return payload
    }
    default: return state
  }
}
const theme = (
  state = localStorage.getItem("wt_theme") || 'light', 
  action
) => {
  const { type, payload } = action
  switch(type) {
    case actionTypes.SET_THEME: {
      return payload
    }
    default: return state
  }
}

// 报价
// --- 货币对列表
const symbolList = (state = {
  list: [],
  // types: [],
  isFetching: true
}, action) => {
  const { type, payload } = action
  switch(type) {
    case actionTypes.GET_SYMBOLS:
      return Object.assign({}, state, {
        ...payload
      })
    case actionTypes.SET_SYMBOLS:
      return Object.assign({}, state, {
        ...state,
        list: payload
      })
    // case GET_SYMBOL_PENDING:
    //   return Object.assign({}, state, {
    //     isFetching: true
    //   })
    // case GET_SYMBOL_FULFILLED:
    //   return Object.assign({}, state, {
    //     list: payload.list,
    //     types: payload.symbolTypes,
    //     isFetching: false
    //   })
    // case GET_SYMBOL_REJECTED:
    default:
      return state
  }
}
// --- 当前选中的货币对类别group
const filterGroup = (state = "", action) => {
  const { type, payload } = action
  switch(type) {
    case actionTypes.SET_SYMBOL_GROUP: {
      return payload
    }
    default: return state
  }
}

// K线
const kLineList = (state = [
  { symbol: 'EURUSD', digits: 5, isActive: false },
  { symbol: 'GBPUSD', digits: 5, isActive: true }
], action) => {
  const { type, payload } = action
  switch(type) {
    case actionTypes.ADD_TO_KLINE: {
      const currSymbol = payload.symbol,
            symbols = state.map(item => item.symbol)
      if(symbols.includes(currSymbol)) {
        return state.map(item => {
          if(item.symbol === currSymbol) {
            item.isActive = true
          } else {
            item.isActive = false
          }
          return item
        })
      } else {
        state = state.map(item => {
          item.isActive = false
          return item
        })
        return [
          ...state,
          payload
        ]
      }

    }
    case actionTypes.DELETE_FROM_KLINE: {
      return state.filter(item => item.symbol !== payload)
    }
    default: return state
  }
}

// 订单
// 持仓单操作
const positionOrder = (state = {
  position: {
    list: [],
    isFetching: false
  },
  order: {
    list: [],
    isFetching: false
  }
}, action) => {
  const { type, payload } = action
  switch(type) {
    case actionTypes.GET_POSITIONS_PENDING:
      return Object.assign({}, state, {
        position: {
          list: state.position.list,
          isFetching: true
        },
        order: {
          list: state.position.list,
          isFetching: true
        }
      })
    case actionTypes.GET_POSITIONS_FULFILLED:
      return Object.assign({}, state, {
        position: {
          list: payload.position,
          isFetching: false
        },
        order: {
          list: payload.order,
          isFetching: false
        }
      })
    case actionTypes.MODIFY_ORDER_PENDING:
      return Object.assign({}, state, {
        ...state,
        position: {
          ...state.position,
          isFetching: true
        }
      })
    case actionTypes.MODIFY_ORDER_FULFILLED: 
      const modifyList = !Number(payload.activeKey) ? state.position.list : state.order.list
      for(var item of modifyList) {
        if(item.ticket == payload.ticket) {
          item.tp = payload.tp
          item.sl = payload.sl
        }
      }
      return Object.assign({}, state, {
        position: {
          isFetching: false,
          list: !Number(payload.activeKey) ? modifyList : state.position.list
        },
        order: {
          isFetching: false,
          list: Number(payload.activeKey) ? modifyList : state.order.list
        }
      })
    case actionTypes.MODIFY_ORDER_REJECTED:
      return Object.assign({}, state, {
        position: {
          ...state.position,
          isFetching: false
        },
        order: {
          ...state.order,
          isFetching: false
        }
      })
    // case actionTypes.GET_POSITIONS_REJECTED: // mock
    //   return Object.assign({}, state, {
    //     position: {
    //       isFetching: false,
    //       list: plist
    //     },
    //     order: {
    //       isFetching: false,
    //       list: olist
    //     }
    //   })
    case actionTypes.CLOSE_ORDER_REJECTED:
      return Object.assign({}, state, {
        ...state,
        position: {
          ...state.position,
          isFetching: false
        },
        order: {
          ...state.order,
          isFetching: false
        }
      })
    case actionTypes.GET_POSITIONS_REJECTED:
    default:
      return state
  }
}

const history = (state = {
  list: [],
  isFetching: false
}, action) => {
  const { type, payload} = action
  switch(type) {
    case actionTypes.GET_HISTORIES_PENDING:
      return Object.assign({}, state, {
        isFetching: true
      })
    case actionTypes.GET_HISTORIES_FULFILLED:
      return Object.assign({}, state, {
        list: payload,
        isFetching: false
      })
    case actionTypes.GET_HISTORIES_REJECTED:
    default: return state
  }
}

// 账户
const accountInfo = (state = {
  isFetching: false,
  info: {
    profit: 0,
    equity: 0,
    balance: 0,
    freeMargin: 0,
    marginLevel: 0,
    margin: 0
  }
}, action) => {
  const { type, payload } = action
  switch(type) {
    case actionTypes.GET_ACCOUNTINFO_PENDING: {
      return Object.assign({}, state, {
        isFetching: true
      })
    }
    case actionTypes.GET_ACCOUNTINFO_FULFILLED: {
      return Object.assign({}, state, {
        isFetching: false,
        info: payload
      })
    }
    case actionTypes.SET_ACCOUNTINFO: {
      return Object.assign({}, state, {
        info: {
          ...state.info,
          ...payload
        }
      })
    }
    case actionTypes.GET_ACCOUNTINFO_REJECTED:
    default: return state
  }
}

export default combineReducers({
  currAcc,
  initSocket,
  theme,
  symbolList,
  filterGroup,
  kLineList,
  positionOrder,
  history,
  accountInfo
})