import { 
  _getPositions, 
  _getHistories, 
  _modifyOrder,
  _closeOrder
} from '../../../../services/index'
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
             MODIFY_ORDER_REJECTED = 'MODIFY_ORDER_REJECTED',
             CLOSE_ORDER = 'CLOSE_ORDER',
             CLOSE_ORDER_PENDING = 'CLOSE_ORDER_PENDING',
             CLOSE_ORDER_FULFILLED = 'CLOSE_ORDER_FULFILLED',
             CLOSE_ORDER_REJECTED = 'CLOSE_ORDER_REJECTED'

// 获取持仓单&挂单
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
// 获取指定时间段的历史订单（默认为全部）
export const getHistories = createAction(GET_HISTORIES, params => {
  return _getHistories(params).then(response => {
    for(var p of response) {
      p.cmdForCh = getCmdArr()[p.cmd]
    }
    return response
  })
})
// 修改订单止盈止损
export const modifyOrder = createAction(MODIFY_ORDER, params => {
  return _modifyOrder(params).then(response => {
    console.log(params,response)
    if(response.code) {
      return params
    }
  })
})
// 平仓/删除挂单
export const closeOrder = createAction(CLOSE_ORDER, params => {
  const { activeKey, ...param } = params
  return _closeOrder(param).then(response => {
    return { ticket: (param.ticket + "").split(","), activeKey }
  })
})
