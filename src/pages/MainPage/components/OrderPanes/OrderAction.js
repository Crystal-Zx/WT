import { _getPositions } from '../../../../services/index'
import { createAction } from 'redux-actions'
import { toDecimal } from '../../../../utils/utilFunc'

export const GET_POSITIONS = 'GET_POSITIONS',
             GET_POSITIONS_PENDING = 'GET_POSITIONS_PENDING',
             GET_POSITIONS_FULFILLED = 'GET_POSITIONS_FULFILLED',
             GET_POSITIONS_REJECTED = 'GET_POSITIONS_REJECTED'

const handleList = (response) => {
  let data = [], dataObj = {}
  const cmdArr = ['Buy', 'Sell', 'Buy Limit', 'Sell Limit', 'Buy Stop', 'Sell Stop']
  for(var p of response) {
    p.key = p.ticket
    p.cmd = cmdArr[p.cmd]
    if(!dataObj[p.symbol]) {
      dataObj[p.symbol] = new Array(p)
    } else {
      dataObj[p.symbol].push(p)
    }
  }
  for(var symbol in dataObj) {
    const isMoreThan1 = dataObj[symbol].length > 1
    data.push({
      key: symbol,
      symbol: symbol,
      ticket: dataObj[symbol].map(item => `${item.ticket}`),
      volume: toDecimal(dataObj[symbol].reduce((prev, currItem) => prev + currItem.volume,0), 2),
      cmd: isMoreThan1 ? '' : dataObj[symbol][0].cmd,
      openPrice: isMoreThan1 ? '' : dataObj[symbol][0].open_price,
      currPrice: '---',  // 即时价需实时更新
      openTime: isMoreThan1 ? '' : dataObj[symbol][0].open_time,
      sl: isMoreThan1 ? '' : dataObj[symbol][0].sl,
      tp: isMoreThan1 ? '' : dataObj[symbol][0].tp,
      storage: toDecimal(dataObj[symbol].reduce((prev, currItem) => prev + currItem.storage,0), 2),
      profit: toDecimal(dataObj[symbol].reduce((prev, currItem) => prev + currItem.profit,0), 2),
      children: isMoreThan1 ? dataObj[symbol] : []
    })
  }
  return data
}

export const getPositions = createAction(GET_POSITIONS, (activeKey) => {
  switch(activeKey) {
    case "0": {
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
          position: handleList(position),
          order: handleList(order)
        }
      })
    }
  }
})