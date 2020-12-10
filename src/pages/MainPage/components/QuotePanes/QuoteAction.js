import { _getSymbols } from '../../../../services/index'

// action类型
export const SET_FILTER_TYPE = 'SET_FILTER_TYPE'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const PUSH_QUOTEBYTYPE = 'PUSH_QUOTEBYTYPE'
// 其他常量


// action创建函数

// 选择显示哪一类报价列表
export function setFilterType (filterType = 'CFD') {
  return {
    type: SET_FILTER_TYPE,
    payload: { filterType }
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
export function requestPosts () { 
  return {
    type: REQUEST_POSTS
  }
}
export function receivePost (list) {
  return {
    type: RECEIVE_POSTS,
    payload: { list }
  }
}
// export function pushQuoteByType (filterType, item) {
//   return {
//     type: PUSH_QUOTEBYTYPE,
//     payload: { filterType, item }
//   }
// }

// thunk action
function axiosPosts () {
  console.log("axiosPosts")
  return function (dispatch,getState) {
    dispatch(requestPosts())
    return _getSymbols().then(
      // 处理数据结构
      response => {
        let list = {
          isFetching: true
        }
        for(var item of response) {
          // dispatch(pushQuoteByType(item.type_name, item))
          list[item.type_name] = list[item.type_name] ? 
            [...list[item.type_name],item] : [item]
        }
        list.isFetching = false
        return list
      },
      error => console.log('An error occured.', error)
    ).then(json => {
      dispatch(receivePost(json))
    })
  }
}

function shouldAxiosPosts(state) {
  const posts = state.list
  const keyLen = Object.keys(state.list).length
  if (keyLen <= 1 && !posts.isFetching) {
    return true
  } else if (posts.isFetching) {
    return false
  }
}

export function axiosPostsIfNeeded() {
  return (dispatch, getState) => {
    const state = getState().QuoteReducer
    if (shouldAxiosPosts(state)) {
      return dispatch(axiosPosts())
    }
  }
}