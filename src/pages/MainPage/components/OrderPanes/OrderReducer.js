import { combineReducers } from 'redux'
import {
  GET_POSITIONS_PENDING,
  GET_POSITIONS_FULFILLED,
  GET_POSITIONS_REJECTED,
  GET_HISTORIES_PENDING,
  GET_HISTORIES_FULFILLED,
  GET_HISTORIES_REJECTED,
  MODIFY_ORDER_PENDING,
  MODIFY_ORDER_FULFILLED,
  MODIFY_ORDER_REJECTED,
  MODIFY_ORDER
} from './OrderAction'

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
    case GET_POSITIONS_PENDING:
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
    case MODIFY_ORDER_PENDING:
      return Object.assign({}, state, {
        ...state,
        position: {
          ...state.position,
          isFetching: true
        }
      })
    case MODIFY_ORDER_FULFILLED:
      console.log(payload, state.position.list)
      const { ticket, tp, sl } = payload
      const pList = state.position.list
      for(var p of pList) {
        if(p.ticket == ticket) {
          p.tp = tp
          p.sl = sl
        }
      }
      console.log("===after change:", pList)
      return Object.assign({}, state, {
        ...state,
        position: {
          isFetching: false,
          list: pList
        }
      })
    case MODIFY_ORDER_REJECTED:
      console.log(action)
      return Object.assign({}, state, {
        ...state,
        position: {
          ...state.position,
          isFetching: false
        }
      })
    case GET_POSITIONS_REJECTED:
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
    case GET_HISTORIES_PENDING:
      return Object.assign({}, state, {
        isFetching: true
      })
    case GET_HISTORIES_FULFILLED:
      return Object.assign({}, state, {
        list: payload,
        isFetching: false
      })
    case GET_HISTORIES_REJECTED:
    default: return state
  }
}

const OrderReducer = combineReducers({
  positionOrder,
  history
})

export default OrderReducer