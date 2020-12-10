import { combineReducers } from 'redux'
import {
  SET_FILTER_TYPE,
  PUSH_QUOTEBYTYPE,
  REQUEST_POSTS,
  RECEIVE_POSTS
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
    case SET_FILTER_TYPE: {
      const { filterType }  = payload
      return filterType
    }
    default: return state
  }
}

function list (state = {
  isFetching: false
}, action) {
  const { type, payload } = action
  switch(type) {
    case REQUEST_POSTS: 
      return Object.assign({}, state, {
        isFetching: true
      })
    // case PUSH_QUOTEBYTYPE:
    //   const { filterType, item } = payload
    //   console.log(filterType)
    //   return filterType && Object.assign({}, state, {
    //     isFetching: true,
    //     [filterType]: state[filterType] ? 
    //       [...state[filterType], item] : [item]
    //   })
    case RECEIVE_POSTS:
      const { list } = payload
      return Object.assign({}, state, {
        ...list,
        isFetching: false
      })
    default: return state
  }
}

const QuoteReducer = combineReducers({
  filterType,
  list
})

export default QuoteReducer