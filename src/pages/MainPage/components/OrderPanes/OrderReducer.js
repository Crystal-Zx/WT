import { combineReducers } from 'redux'
import {
  GET_POSITIONS_PENDING,
  GET_POSITIONS_FULFILLED,
  GET_POSITIONS_REJECTED
} from './OrderAction'

// 持仓单操作
const position = (state = {
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
    case GET_POSITIONS_PENDING:
      return Object.assign({}, state, {
        position: {
          // ...list,
          isFetching: true
        },
        order: {
          // ...list,
          isFetching: true
        }
      })
    case GET_POSITIONS_FULFILLED:
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
    case GET_POSITIONS_REJECTED:
    default:
      return state
  }
}

const OrderReducer = combineReducers({
  position
})

export default OrderReducer