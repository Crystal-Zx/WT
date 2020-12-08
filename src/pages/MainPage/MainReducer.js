import { combineReducers } from 'redux'
import {
  SELECT_QUOTETYPE,
  GET_QUOTEBYTYPE,
  RECEIVE_QUOTEBYTYPE
} from './MainAction'

const initialState = {
  token: 'MTE5MjI6MTYwNzM5ODc1Mjo5ODY3YWFiYTg4N2JkOWRiOTFiODFkZDQ3NzUzNzU2NA==',
  visibilityFilter: 'SHOW_FX',
  symbolCategory: ['<StarFilled />', 'FX', 'IND', 'STO', 'ALL'],
  symbolList: [
    {
      symbol: 'Starbucks',
      spread: '-0.02%',
      sell: '0.72631',
      buy: '0.72659',
      volume: '0.01'
    }
  ]
}

// 选择显示哪一类报价列表
function selecteQuoteCategory (state, action) {
  const { type, payload } = action
  const { qType }  = payload
  switch(type) {
    case SELECT_QUOTETYPE: {
      return qType
    }
    default: return state
  }
}

// 获取指定类别报价列表 （暂无）
// function postQuote (
//   state = {
//     isFetching: false,
//     items: []
//   },
//   action
// ) {
//   const { type, payload } = action
//   switch(type) {
//     case GET_QUOTEBYCATEGORY: 
//       return Object.assign({}, state, {
//         isFetching: true
//       })
//     case RECEIVE_QUOTEBYCATEGORY: 
//       return Object.assign({}, state, {
//         isFetching: false,
//         items: payload
//       })
//     default: return state
//   }
// }

// function postByQuoteCategory (state = {}, action) {
//   const { type, payload } = action
//   const { qType }  = payload
//   switch(type) {
//     case GET_QUOTEBYTYPE:
//     case RECEIVE_QUOTEBYTYPE: 
//       return Object.assign({}, state, {
//         [qType]: 
//       })
//   }
// }

const MainReducer = combineReducers({
  // selecteQuoteCategory
})

export default MainReducer