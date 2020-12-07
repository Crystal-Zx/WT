// action类型
export const ADD_SYMBOL = 'ADD_SYMBOL'

// 其他常量

// action创建函数
export function addSymbol (payload) {
  return {
    type: ADD_SYMBOL,
    payload
  }
}