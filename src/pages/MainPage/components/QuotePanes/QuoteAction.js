import { _getSymbols } from '../../../../services/index'
import { createAction } from 'redux-actions'

// export const GET_STYMBOLS = 'GET_STYMBOLS'
export const SET_SYMBOL_TYPE = 'SET_SYMBOL_TYPE'

// action types
export const GET_STYMBOLS = 'GET_STYMBOLS',
             GET_STYMBOLS_PENDING = 'GET_STYMBOLS_PENDING',
             GET_STYMBOLS_FULFILLED = 'GET_STYMBOLS_FULFILLED',
             GET_STYMBOLS_REJECTED = 'GET_STYMBOLS_REJECTED',
             SET_STYMBOLS = 'SET_STYMBOLS'

// export const getSymbols = createAction(GET_STYMBOLS, () => 
//   _getSymbols().then(response => {
//     const symbolTypes = response.map(item => item.symbol)
//     // 处理数据结构
//     let list = {}, isFetching = true
//     // console.log(response)
//     for(var item of response) {
//       item.key = item.symbol
//       item.spread = '---'
//       item.sell = '---'
//       item.buy = '---'
//       item.isShow = 1
//       item.high = '---'
//       item.low = '---'
//       item.per = '---'
//       list[item.type_name] = list[item.type_name] ? 
//         [...list[item.type_name],item] : [item]
//     }
//     isFetching = false
//     return {
//       list, symbolTypes, isFetching
//     }
//   })
// )
// --- 存储货币对（来源：websocket）
export const getSymbols = createAction(GET_STYMBOLS, payload => payload)
export const setSymbols = createAction(SET_STYMBOLS, payload => payload)
// 选择显示哪一类报价列表
export const setSymbolType = createAction(SET_SYMBOL_TYPE, filterType => filterType)