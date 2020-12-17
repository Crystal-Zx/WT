import { combineReducers } from 'redux'
import {
  INIT_SOCKET,
  ADD_TO_KLINE,
  DELETE_FROM_KLINE
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

export default combineReducers({
  initSocket,
  KLineList
})