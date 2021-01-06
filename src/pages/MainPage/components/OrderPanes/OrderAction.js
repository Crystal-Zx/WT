import { _getPositions, _getHistories, _modifyOrder } from '../../../../services/index'
import { createAction } from 'redux-actions'
import { getCmdArr } from '../../../../utils/utilFunc'

export const GET_POSITIONS = 'GET_POSITIONS',
             GET_POSITIONS_PENDING = 'GET_POSITIONS_PENDING',
             GET_POSITIONS_FULFILLED = 'GET_POSITIONS_FULFILLED',
             GET_POSITIONS_REJECTED = 'GET_POSITIONS_REJECTED',
             GET_HISTORIES = 'GET_HISTORIES',
             GET_HISTORIES_PENDING = 'GET_HISTORIES_PENDING',
             GET_HISTORIES_FULFILLED = 'GET_HISTORIES_FULFILLED',
             GET_HISTORIES_REJECTED = 'GET_HISTORIES_REJECTED',
             MODIFY_ORDER = 'MODIFY_ORDER',
             MODIFY_ORDER_PENDING = 'MODIFY_ORDER_PENDING',
             MODIFY_ORDER_FULFILLED = 'MODIFY_ORDER_FULFILLED',
             MODIFY_ORDER_REJECTED = 'MODIFY_ORDER_REJECTED'

export const getPositions = createAction(GET_POSITIONS, () => {
  return _getPositions().then(response => {
    let position = [], order = []
    for(var p of response) {
      if(Number(p.cmd) < 2) {  // 持仓单
        position.push(p)
      } else {  // 挂单
        order.push(p)
      }
    }
    return {
      position: position,
      order: order
    }
  })
})

export const getHistories = createAction(GET_HISTORIES, (params) => {
  return _getHistories(params).then(response => {
    for(var p of response) {
      p.cmdForCh = getCmdArr()[p.cmd]
    }
    return response
  })
})

// open_price, ticket, tp, sl
export const modifyOrder = createAction(MODIFY_ORDER, (params) => {
  return _modifyOrder(params).then(response => {
    console.log(params,response)
    if(response.code) {
      return params
    }
  })
  // .catch(err => {
  //   throw err
  // })
})
