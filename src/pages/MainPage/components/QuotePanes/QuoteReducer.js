import { combineReducers } from 'redux'
import {
  SET_SYMBOL_TYPE,
  GET_STYMBOLS_PENDING,
  GET_STYMBOLS_FULFILLED,
  GET_STYMBOLS_REJECTED
} from './QuoteAction'

// 选择显示哪一类报价列表
const filterType = (state = "", action) => {
  const { type, payload } = action
  switch(type) {
    case SET_SYMBOL_TYPE: {
      return payload
    }
    default: return state
  }
}

const symbolList = (state = {
  isFetching: false
}, action) => {
  const { type, payload } = action
  switch(type) {
    case GET_STYMBOLS_PENDING:
      return Object.assign({}, state, {
        isFetching: true
      })
    case GET_STYMBOLS_FULFILLED:
      return Object.assign({}, state, {
        ...payload,
        isFetching: false
      })
    case GET_STYMBOLS_REJECTED:
    default:
      return state
  }
}

const QuoteReducer = combineReducers({
  filterType,
  symbolList
})

export default QuoteReducer