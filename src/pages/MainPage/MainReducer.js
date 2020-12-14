import { combineReducers } from 'redux'
import {
  INIT_SOCKET
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

export default combineReducers({
  initSocket
})