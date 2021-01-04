import CardTabs from '../../../../components/CardTabs/CardTabs'
import OrderSPanes from './OrderSPanes'
import styles from './OrderPanes.module.scss'

import React,{ useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { toDecimal } from '../../../../utils/utilFunc'
import { getPositions, getHistories } from './OrderAction' 
import { setAccountInfo } from '../../MainAction'

const OrderPanes = ({ socket, info, opData, dispatch}) => {
  // console.log("====OrderPanes", info)
  const [activeKey, setActiveKey] = useState("0")
  const [listArr, setListArr] = useState(opData)

  const onChange = activeKey => {
    setActiveKey(activeKey)
    socket.on("order", (data) => onMessage(data, activeKey))
    if(!listArr[activeKey].list.length && !listArr[activeKey].isFetching) {
      activeKey < 2 && dispatch(getPositions())
      activeKey >= 2 && dispatch(getHistories({
        from: 0, to: new Date().getTime()
      })).then(res => {
        const totalProfit = res.value.reduce((prev, item) => prev + Number(item.profit), 0)
        dispatch(setAccountInfo({ profit: totalProfit }))
      })
    } else if(activeKey === "2") {
      const totalProfit = listArr[2].list.reduce((prev, item) => prev + Number(item.profit), 0)
      dispatch(setAccountInfo({ profit: totalProfit }))
    }
  }

  const init = () => {
    if(!listArr[activeKey].list.length && !listArr[activeKey].isFetching) {
      activeKey < 2 && dispatch(getPositions())
      activeKey >= 2 && dispatch(getHistories({
        from: 0, to: new Date().getTime()
      }))
    }
  }

  const isBuy = (type,filter = ["buy","buylimit","buystop"]) => {
    for(var _type of filter) {
      if(type.toLowerCase() === _type.toLowerCase()) return true
    }
    return false
  }

  const onMessage = (data, activeKey) => {
    const ospData = listArr[activeKey].list
    if(data.type === 'quote' && Number(activeKey) !== 2) {  // 理论上说应该没必要再判断一次data.type，不过保险起见
      data = data.data
      for(let trd of ospData) {
        if(trd.symbol !== data.symbol) continue
        if(trd.children.length) {
          // 遍历处理同一货币对下的不同订单的即时价&盈利值
          for(let cd of trd.children) {
            if(cd.symbol === data.symbol) {
              let flag
              if(isBuy(cd.cmd)) {  // 多单 buy
                cd.close_price = data.bid
                flag = 1
              } else {  // 空单 sell
                cd.close_price = data.ask
                flag = -1
              }
              // 10000 -> data.contract_size；0.00965372 -> data.trans_price
              if(!Number(activeKey)) {
                cd.profit = ((cd.close_price - cd.open_price) * cd.volume * 100000 * 0.00965372 * flag).toFixed(2)
              }
              cd.close_price = toDecimal(cd.close_price, data.digits)
            }
          }
          // 更新该货币对下的盈利值
          if(!Number(activeKey)) {
            trd.profit = (trd.children.reduce((prev, item) => prev + Number(item.profit),0)).toFixed(2)
          }
        } else {
          let flag
          if(isBuy(trd.cmd)) {  // 多单 buy
            trd.close_price = data.bid
            flag = 1
          } else {  // 空单 sell
            trd.close_price = data.ask
            flag = -1
          }
          if(!Number(activeKey)) {
            trd.profit = ((trd.close_price - trd.open_price) * trd.volume * 100000 * 0.00965372 * flag).toFixed(2)
          }
          trd.close_price = toDecimal(trd.close_price, data.digits)
        }
      }
      listArr[activeKey].list = ospData
      setListArr(listArr.concat([]))
      // 更新store中用户账户信息数据
      if(Object.keys(info).length) {
        // 浮动盈亏，即盈利
        info.profit = ospData.reduce((prev, item) => prev + Number(item.profit),0)
        // 净值
        info.equity = info.balance + info.profit
        // 可用保证金
        info.freeMargin = info.equity - info.margin
        // 保证金比例
        info.marginLevel = info.equity - info.freeMargin ? Math.floor(info.equity / (info.equity - info.freeMargin) * 10000) / 100 : 0
        // setAccountInfo(info)
        dispatch(setAccountInfo(info))
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setListArr(opData)
  }, [JSON.stringify(opData)])

  useEffect(() => {
    if(Object.keys(socket).length && listArr[0].list && listArr[0].list.length) {
      socket.on("order", (data) => onMessage(data, activeKey))
    }
  }, [JSON.stringify(socket), JSON.stringify(listArr[0])])

  return (
    <CardTabs
      className={styles['order-x']}
      initialPanes={[
        { title: '持仓单', content: <OrderSPanes data={listArr[0]} type="0" />, key: '0'
        },
        { title: '挂单交易', content: <OrderSPanes data={listArr[1]} type="1" />, key: '1' },
        { title: '历史订单', content: <OrderSPanes data={listArr[2]} type="2" />, key: '2' }
      ]}
      activeKey={activeKey}
      onChange={onChange}
    ></CardTabs>
  )
}

const areEqual = (prevProps, nextProps) => {
  /* 如果把 nextProps 传入 render 方法的返回结果与将 prevProps 传入 render 方法的返回结果一致则返回 true，否则返回 false。
  即： 不更新返回true；需更新返回false */
  // console.log("====areEqual", prevProps.info, nextProps.info, JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info))
  if(JSON.stringify(prevProps.opData) === JSON.stringify(nextProps.opData) && JSON.stringify(prevProps.socket) === JSON.stringify(nextProps.socket) && JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)) {
    return true
  } else {
    return false
  }
}

export default connect(
  state => {
    const {
      position,
      history = {}
    } = state.OrderReducer
    const { initSocket, accountInfo } = state.MainReducer
    
    return {
      socket: initSocket,
      info: accountInfo.info,
      opData: [
        position.position, position.order, history
      ]
    }
  }
)(React.memo(OrderPanes, areEqual))