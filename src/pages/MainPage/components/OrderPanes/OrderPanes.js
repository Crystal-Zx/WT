import { Modal, InputNumber, notification } from 'antd'
import CardTabs from '../../../../components/CardTabs/CardTabs'
import OrderSPanes from './OrderSPanes'
import styles from './OrderPanes.module.scss'

import React,{ useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import { getPositions, getHistories, closeOrder } from './OrderAction' 
import { setAccountInfo } from '../../MainAction'
import { toDecimal, isBuy } from '../../../../utils/utilFunc'
import IconFont from '../../../../utils/iconfont/iconfont'

const OrderPanes = ({ socket, info, listArr, dispatch}) => {
  console.log("====OrderPanes", listArr)
  const [activeKey, setActiveKey] = useState("0")
  // const [listArr, setListArr] = useState(opData)
  const volumeRef = useRef(null)

  const { confirm } = Modal


  const init = () => {
    if(!listArr[activeKey].list.length && !listArr[activeKey].isFetching) {
      activeKey < 2 && dispatch(getPositions())
      activeKey >= 2 && dispatch(getHistories({
        from: 0, to: new Date().getTime()
      }))
    }
  }
  // 右上角全局提示
  const openNotificationWithIcon = params => {
    const { type, msg, desc } = params
    notification[type]({
      message: msg, description: desc
    })
  }
  const onChange = activeKey => {
    setActiveKey(activeKey)
    // socket.on("order", (data) => onMessage(data, activeKey))
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
  const onMessage = (data, activeKey) => {
    const ospData = listArr[activeKey].list
    // console.log("====ospData:", ospData)
    if(data.type === 'quote' && Number(activeKey) !== 2) {  // 理论上说应该没必要再判断一次data.type，不过保险起见
      data = data.data
      for(let item of ospData) {
        if(item.symbol !== data.symbol) continue
        let flag
        if(isBuy(item.cmdForCh)) {  // 多单 buy
          item.close_price = data.bid
          flag = 1
        } else {  // 空单 sell
          item.close_price = data.ask
          flag = -1
        }
        if(!Number(activeKey)) {
          item.profit = ((item.close_price - item.open_price) * item.volume * data.contract_size * data.trans_price_ask * flag).toFixed(2)
        }
        item.close_price = toDecimal(item.close_price, data.digits)
      }
      listArr[activeKey].list = ospData
      // console.log(listArr[0].list)
      // setListArr(listArr.concat([]))
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
  const onCloseOrder = (tickets) => {
    const ticketsStr = Array.isArray(tickets) ? tickets.join(",") : tickets
    dispatch(closeOrder({
      lots: volumeRef.current.input.value, ticket: ticketsStr, activeKey
    })).then(res => {
      // console.log("====onOk then:",res)
      const { ticket } = res.value
      openNotificationWithIcon({
        type: 'success', msg: `${Number(activeKey) === 0 ? '平仓' : '删除挂单'}成功`, desc: `被操作的订单编号为：${ticket.join(",")}`
      })
      // 重新获取持仓/挂单列表
      dispatch(getPositions())
    }).catch(err => {
      // console.log("====onOk catch:",err)
      openNotificationWithIcon({
        type: 'error', msg: `${Number(activeKey) === 0 ? '平仓' : '删除挂单'}失败`, desc: err
      })
    })
  }
  const onShowConfirmForSingle = (item) => {
    confirm({
      title: `确定${Number(activeKey) === 0 ? '平仓' : '删除该挂单'}？`,
      icon: <IconFont type="iconWarning" />,
      content: (
        <>
          <span>请选择平仓手数：</span>
          <InputNumber
            ref={volumeRef}
            min={0.01}
            max={item.volume}
            step={0.01}
            defaultValue={item.volume}
            size="small"
          />
        </>
      ),
      className: "op-confirm-closeOrder",
      okText: "确定",
      cancelText: "取消",
      getContainer: () => document.querySelector(".main-middle-x .ant-tabs-card"),
      onOk: () => {
        return onCloseOrder(item.ticket)
      },
      onCancel: () => {
        console.log("cancel")
      }
    })
  }
  const onShowConfirmForAll = (tickets) => {
    confirm({
      title: `确定${Number(activeKey) === 0 ? '平仓' : '删除'}下列订单号的订单？`,
      icon: <IconFont type="iconWarning" />,
      content: (
        <p>{tickets}</p>
      ),
      className: "op-confirm-closeOrder",
      okText: "确定",
      cancelText: "取消",
      getContainer: () => document.querySelector(".main-middle-x .ant-tabs-card"),
      onOk: () => {
        return onCloseOrder(tickets)
      },
      onCancel: () => {
        console.log("cancel")
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  // useEffect(() => {
  //   setListArr(opData)
  // }, [JSON.stringify(opData)])

  useEffect(() => {
    if(Object.keys(socket).length && listArr[0].list && listArr[0].list.length) {
      socket.on("order", (data) => onMessage(data, activeKey))
    }
  }, [JSON.stringify(socket), JSON.stringify(listArr[0])])

  return (
    <CardTabs
      className={styles['order-x']}
      initialPanes={[
        { title: '持仓单', content: 
          <OrderSPanes 
            data={listArr[0]}
            type="0"
            onShowConfirmForSingle={onShowConfirmForSingle}
            onShowConfirmForAll={onShowConfirmForAll}
          />,
          key: '0'
        },
        { title: '挂单交易', content: 
          <OrderSPanes 
            data={listArr[1]}
            type="1" 
            onShowConfirmForSingle={onShowConfirmForSingle}
            onShowConfirmForAll={onShowConfirmForAll}
          />, key: '1' },
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
  console.log("====OP areEqual", prevProps.listArr, nextProps.listArr, JSON.stringify(prevProps.listArr) === JSON.stringify(nextProps.listArr))
  if(JSON.stringify(prevProps.listArr) === JSON.stringify(nextProps.listArr) && JSON.stringify(prevProps.socket) === JSON.stringify(nextProps.socket) && JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)) {
    return true
  } else {
    return false
  }
}

export default connect(
  state => {
    const {
      positionOrder,
      history = {}
    } = state.OrderReducer
    const { initSocket, accountInfo } = state.MainReducer
    const { position, order } = positionOrder
    console.log("store state:", state)
    return {
      socket: initSocket,
      info: accountInfo.info,
      listArr: [
        position, order, history
      ]
    }
  }
)(React.memo(OrderPanes, areEqual))