import { combineReducers } from 'redux'
import {
  INIT_SOCKET,
  ADD_TO_KLINE
} from './MainAction'

const initSocket = (state = {}, action) => {
  const { type, payload } = action
  switch(type) {
    case INIT_SOCKET: {
      console.log(state, payload)
      return payload
    }
    default: return state
  }
}

const addToKLine = (state = [
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
    default: return state
  }
}

export default combineReducers({
  initSocket,
  addToKLine
})