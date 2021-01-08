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
  CLOSE_ORDER_PENDING,
  CLOSE_ORDER_FULFILLED,
  CLOSE_ORDER_REJECTED
} from './OrderAction'

// mock数据
import {
  plist, olist
} from '../../../../services/mock'

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
    case MODIFY_ORDER_REJECTED:
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
    case GET_POSITIONS_REJECTED: // mock
      return Object.assign({}, state, {
        position: {
          isFetching: false,
          list: plist
        },
        order: {
          isFetching: false,
          list: olist
        }
      })
    case CLOSE_ORDER_REJECTED:
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