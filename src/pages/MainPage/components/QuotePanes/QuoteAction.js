import { _getSymbols } from '../../../../services/index'
import { createAction } from 'redux-actions'

// export const GET_STYMBOLS = 'GET_STYMBOLS'
export const SET_SYMBOL_TYPE = 'SET_SYMBOL_TYPE'


// action types
export const GET_STYMBOLS = 'GET_STYMBOLS',
             GET_STYMBOLS_PENDING = 'GET_STYMBOLS_PENDING',
             GET_STYMBOLS_FULFILLED = 'GET_STYMBOLS_FULFILLED',
             GET_STYMBOLS_REJECTED = 'GET_STYMBOLS_REJECTED'

export const getSymbols = createAction(GET_STYMBOLS, () => 
  _getSymbols().then(response => {
    // 处理数据结构
    let list = {
      isFetching: true
    }
    for(var item of response) {
      list[item.type_name] = list[item.type_name] ? 
        [...list[item.type_name],item] : [item]
    }
    list.isFetching = false
    return list
  })
)
// 选择显示哪一类报价列表
export const setSymbolType = createAction(SET_SYMBOL_TYPE, filterType => filterType)