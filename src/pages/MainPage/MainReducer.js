import { initial } from 'lodash'
import { combineReducers } from 'redux'
import {
  SELECT_QUOTETYPE,
  // POST_QUOTE,
  // RECEIVE_QUOTE,
  PUSH_QUOTEBYTYPE,
  PUSH_START,
  PUSH_END
} from './MainAction'

// isFetching -> 是否在抓取数据
// didInvalidate -> 数据是否过时
// lastUpdate -> 上一次更新时间
// 操作开始时，送出一个action，触发state更新为“正在操作”的状态，View重新渲染；结束后，再送出一个action，触发state更新为“操作结束”的状态，Viwe再一次更新
const initialState = {
  quoteType: 'Indexes',
  quoteList: {
    // Indexes: {
    //   isFetching: false,  
    //   items: []
    // },
    // CFD: {
    //   isFetching: false,
    //   items: []
    // }
  }
}

// 选择显示哪一类报价列表
function quoteType (state = initialState.quoteType, action) {
  const { type, payload } = action
  switch(type) {
    case SELECT_QUOTETYPE: {
      const { qType }  = payload
      return qType
    }
    default: return state
  }
}

// 获取所有报价列表（需自行整理成所需格式）
// function postQuote (
//   state = {
//     isFetching: false,
//     items: []
//   },
//   action
// ) {
//   const { type, payload } = action
//   const { data } = payload
//   switch(type) {
//     case POST_QUOTE:
//       return Object.assign({}, state, {
//         isFetching: true
//       })
//     case RECEIVE_QUOTE: 
//       return Object.assign({}, state, {
//         isFetching: false,
//         items: data
//       })
//     default: return state
//   }
// }

function quoteList (state = initialState, action) {
  console.log(initialState)
  const { type, payload } = action
  switch(type) {
    case PUSH_START: 
      console.log("PUSH_START")
      return Object.assign({}, state, {
        isFetching: true
      })
    case PUSH_QUOTEBYTYPE:
      console.log('postQuoteByType======PUSH_QUOTEBYTYPE')
      const { qType, item } = payload
      return qType && Object.assign({}, state, {
        isFetching: true,
        [qType]: {
          items: state[qType].items.push(item)
        }
      })
    case PUSH_END:
      console.log("PUSH_END")
      return Object.assign({}, state, {
        isFetching: false
      })
    default: return state
  }
}

// function postQuoteByType (state = {}, action) {
//   const { type, payload } = action
//   const { qType }  = payload
//   switch(type) {
//     case PUSH_QUOTEBYTYPE: 
//       return Object.assign({}, state, {
//         [qType]: postQuote
//       })
//   }
// }
// function postQuoteByType (state = {}, action) {
//   const { type, payload } = action
//   const { qType }  = payload
//   switch(type) {
//     case POST_QUOTE:
//     case RECEIVE_QUOTE: 
//       return Object.assign({}, state, {
//         [qType]: postQuote
//       })
//   }
// }

const MainReducer = combineReducers({
  quoteType,
  quoteList
})

export default MainReducer