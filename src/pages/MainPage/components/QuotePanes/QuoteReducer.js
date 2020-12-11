import { combineReducers } from 'redux'
import {
  SET_SYMBOL_TYPE,
  GET_STYMBOLS_PENDING,
  GET_STYMBOLS_FULFILLED,
  GET_STYMBOLS_REJECTED
} from './QuoteAction'

// isFetching -> 是否在抓取数据
// didInvalidate -> 数据是否过时
// lastUpdate -> 上一次更新时间
// 操作开始时，送出一个action，触发state更新为“正在操作”的状态，View重新渲染；结束后，再送出一个action，触发state更新为“操作结束”的状态，Viwe再一次更新
// const initialState = {
//   filterType: 'Indexes'
// }

// 选择显示哪一类报价列表
function filterType (state = "", action) {
  const { type, payload } = action
  switch(type) {
    case SET_SYMBOL_TYPE: {
      return payload
    }
    default: return state
  }
}

// function list (state = {
//   isFetching: false
// }, action) {
//   const { type, payload } = action
//   switch(type) {
//     case REQUEST_POSTS: 
//       return Object.assign({}, state, {
//         isFetching: true
//       })
//     case RECEIVE_POSTS:
//       return Object.assign({}, state, {
//         ...payload,
//         isFetching: false
//       })
//     default: return state
//   }
// }

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