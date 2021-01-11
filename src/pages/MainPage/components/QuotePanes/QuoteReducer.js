import { combineReducers } from 'redux'
import {
  SET_SYMBOL_TYPE,
  GET_STYMBOLS_PENDING,
  GET_STYMBOLS_FULFILLED,
  GET_STYMBOLS_REJECTED,
  GET_STYMBOLS
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
  list: [],
  types: [],
  isFetching: false
}, action) => {
  const { type, payload } = action
  switch(type) {
    case GET_STYMBOLS:
      return Object.assign({}, state, {
        ...payload
      })
    // case GET_STYMBOLS_PENDING:
    //   return Object.assign({}, state, {
    //     isFetching: true
    //   })
    // case GET_STYMBOLS_FULFILLED:
    //   return Object.assign({}, state, {
    //     list: payload.list,
    //     types: payload.symbolTypes,
    //     isFetching: false
    //   })
    // case GET_STYMBOLS_REJECTED:
    default:
      return state
  }
}

const QuoteReducer = combineReducers({
  filterType,
  symbolList
})
// 以上等价于：
// const QuoteReducer = function (state, action) {
//   return {
//     filterType: filterType(state.filterType, action),
//     symbolList: symbolList(state.symbolList, action)
//   }
// }
// 或者可以取别名
// const QuoteReducer = function (state, action) {
//   return {
//     a: filterType(state.a, action),
//     b: symbolList(state.b, action)
//   }
// }

export default QuoteReducer