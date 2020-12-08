// action类型
export const SELECT_QUOTETYPE = 'SELECT_QUOTETYPE'
export const GET_QUOTEBYTYPE = 'GET_QUOTEBYTYPE'
export const RECEIVE_QUOTEBYTYPE = 'RECEIVE_QUOTEBYTYPE'

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
export function getQuoteByTYPE (qType) {
  return {
    type: GET_QUOTEBYTYPE,
    payload: { qType }
  }
}
export function receiveQuoteByTYPE (data) {
  return {
    type: RECEIVE_QUOTEBYTYPE,
    payload: data
  }
}