import { _getSymbols } from '../../services/index'

// action类型
export const SELECT_QUOTETYPE = 'SELECT_QUOTETYPE'
// export const POST_QUOTE = 'POST_QUOTE'
// export const RECEIVE_QUOTE = 'RECEIVE_QUOTE'
export const PUSH_START = 'PUSH_START'
export const PUSH_END = 'PUSH_END'
export const PUSH_QUOTEBYTYPE = 'PUSH_QUOTEBYTYPE'
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
// export function postQuote () { 
//   return {
//     type: POST_QUOTE
//   }
// }
// export function receiveQuote (data) {
//   return {
//     type: RECEIVE_QUOTE,
//     payload: { data }
//   }
// }
export function pushStart () { 
  return {
    type: PUSH_START
  }
}
export function pushEnd () {
  return {
    type: PUSH_END
  }
}
export function pushQuoteByType (qType, item) {
  return {
    type: PUSH_QUOTEBYTYPE,
    payload: { qType, item }
  }
}

// thunk action
export function axiosPosts () {
  return function (dispatch) {
    console.log("axiosPost")
    dispatch(pushStart())
    return _getSymbols().then(
      // 处理数据结构
      response => {
        // response = response.data
        console.log(response)
        // for(var item of response) {
        //   dispatch(pushQuoteByType(item.type_name, item))
        // }
      },
      error => console.log('An error occured.', error)
    ).then(json => 
      dispatch(pushEnd())
      // console.log(state)
    )
  }
}