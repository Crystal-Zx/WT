import { combineReducers } from 'redux'
import {
  INIT_SOCKET,
  ADD_TO_KLINE,
  DELETE_FROM_KLINE,
  SET_ACCOUNTINFO,
  GET_ACCOUNTINFO_PENDING,
  GET_ACCOUNTINFO_FULFILLED,
  GET_ACCOUNTINFO_REJECTED
} from './MainAction'

const initSocket = (state = {}, action) => {
  const { type, payload } = action
  switch(type) {
    case INIT_SOCKET: {
      return payload
    }
    default: return state
  }
}

const KLineList = (state = [
  { symbol: 'EURUSD', digits: 5},
  { symbol: 'GBPUSD', digits: 5}
], action) => {
  const { type, payload } = action
  switch(type) {
    case ADD_TO_KLINE: {
      return [
        ...state,
        payload
      ]
    }
    case DELETE_FROM_KLINE: {
      return state.filter(item => item.symbol !== payload)
    }
    default: return state
  }
}

const accountInfo = (state = {
  isFetching: false,
  info: {
    // profit: 0,
    // equity: 0,
    // balance: 0,
    // freeMargin: 0,
    // marginLevel: 0,
    // margin: 0
  }
}, action) => {
  const { type, payload } = action
  switch(type) {
    case GET_ACCOUNTINFO_PENDING: {
      return Object.assign({}, state, {
        isFetching: true
      })
    }
    case GET_ACCOUNTINFO_FULFILLED: {
      return Object.assign({}, state, {
        isFetching: false,
        info: payload
      })
    }
    case SET_ACCOUNTINFO: {
      return Object.assign({}, state, {
        info: {
          ...payload
        }
      })
    }
    case GET_ACCOUNTINFO_REJECTED:
    default: return state
  }
}

export default combineReducers({
  initSocket,
  KLineList,
  accountInfo
})