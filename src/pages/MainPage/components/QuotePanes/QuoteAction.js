import { _getSymbols } from '../../../../services/index'
import { createAction } from 'redux-actions'

// action类型
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

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

// 其他常量


// action创建函数


// 发送axios请求的状态（后期公用）
// const requestPosts = createAction(REQUEST_POSTS)
// const receivePost = createAction(RECEIVE_POSTS, data => data) // payload = data

// axios：获取报价列表
// const getSymbols = () => {
//   return (dispatch, getState) => {  // redux-thunk
//     const list = getState().QuoteReducer.list
//     const keyLen = Object.keys(list).length
//     const defaultType = Object.keys(list).filter(qType => qType !== 'isFetching')[0]
//     if (keyLen <= 1 && !list.isFetching) {  // list中没有报价数据且未在抓取数据中
//       dispatch(requestPosts())
      
//       return _getSymbols().then(response => {  // redux-promise
//         // 处理数据结构
//         let list = {
//           isFetching: true
//         }
//         for(var item of response) {
//           list[item.type_name] = list[item.type_name] ? 
//             [...list[item.type_name],item] : [item]
//         }
//         list.isFetching = false
//         return list
//       }).then(list => {
//         dispatch(receivePost(list))
//         // dispatch(setFilterType(defaultType))
//       }).catch(error => {
//         console.log("error:",error)
//         // dispatch失败的action
//         // ...
//       })
//     }
//   }
// }

// thunk action
// 获取报价板块货币对列表
// function axiosPosts () {
//   return function (dispatch) {
//     dispatch(requestPosts())
//     return _getSymbols().then(
//       // 处理数据结构
//       response => {
//         let list = {
//           isFetching: true
//         }
//         for(var item of response) {
//           list[item.type_name] = list[item.type_name] ? 
//             [...list[item.type_name],item] : [item]
//         }
//         list.isFetching = false
//         return list
//       })
//     .then(json => {
//       dispatch(receivePost(json))
//     })
//     .catch(err => console.log(err))
//   }
// }
// function shouldAxiosPosts(state) {
//   const posts = state.list
//   const keyLen = Object.keys(state.list).length
//   if (keyLen <= 1 && !posts.isFetching) {
//     return true
//   } else if (posts.isFetching) {
//     return false
//   }
// }
// export function axiosPostsIfNeeded() {
//   return (dispatch, getState) => {
//     const state = getState().QuoteReducer
//     if (shouldAxiosPosts(state)) {
//       return dispatch(axiosPosts())
//     }
//   }
// }