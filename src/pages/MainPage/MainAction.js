import { _getSymbols } from '../../services/index'

// action类型
export const SELECT_QUOTETYPE = 'SELECT_QUOTETYPE'
export const GET_QUOTE = 'GET_QUOTE'
export const RECEIVE_QUOTE = 'RECEIVE_QUOTE'

// 其他常量


// action创建函数

// 选择显示哪一类报价列表
export function selectQuoteTYPE (qType = 'CFD') {
  return {
    type: SELECT_QUOTETYPE,
    payload: { qType }
  }
}

// 获取指定类别报价列表 （暂无）
export function getQuote () { 
  return {
    type: GET_QUOTE
  }
}
export function receiveQuote (data) {
  return {
    type: RECEIVE_QUOTE,
    payload: { data }
  }
}

// thunk action
export function axiosPosts () {
  return function (dispatch) {
    dispatch(getQuote())
    return _getSymbols().then(
      response => response.json(),
      error => console.log('An error occured.', error)
    ).then(json => 
      dispatch(receiveQuote(json))
    )
  }
}