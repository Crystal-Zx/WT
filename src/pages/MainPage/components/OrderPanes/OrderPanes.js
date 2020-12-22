import { Table, Menu, Dropdown, Button, Badge } from 'antd'
// import styles from './OrderPanes.module.scss'
// import IconFont from '../../../../utils/iconfont/iconfont'
import CardTabs from '../../../../components/CardTabs/CardTabs'
import OrderSPanes from './OrderSPanes'
import styles from './OrderPanes.module.scss'

import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { getPositions } from './OrderAction' // , getOrders, getHistories

const OrderPanes = ({ listArr, dispatch}) => {
  console.log("===OP PROPS:", listArr)
  const lastColMenu = (
    <Menu>
      <Menu.Item>
        <>对所有头寸进行平仓</>
      </Menu.Item>
      <Menu.Item>
        <>对盈利头寸进行平仓（净利）</>
      </Menu.Item>
      <Menu.Item>
        <>对亏损头寸进行平仓（净利）</>
      </Menu.Item>
    </Menu>
  )
  const [activeKey, setActiveKey] = useState("0")
  const [list, setList] = useState(listArr[0])

  const onChange = activeKey => {
    setActiveKey(activeKey)
    setList(listArr[activeKey])
    console.log(!listArr[activeKey].list.length, !listArr[activeKey].isFetching)
    if(!listArr[activeKey].list.length && !listArr[activeKey].isFetching) {
      dispatch(getPositions(activeKey))
    }
  }

  const init = () => {
    if(!list.list.length && !list.isFetching) {
      dispatch(getPositions(activeKey))
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <CardTabs
      className={styles['order-x']}
      initialPanes={[
        { title: '持仓单', content: <OrderSPanes data={listArr[0]} type="0" />, key: '0' },
        { title: '挂单交易', content: <OrderSPanes data={listArr[1]} type="1" />, key: '1' },
        { title: '历史订单', content: <OrderSPanes data={listArr[2]} type="2" />, key: '2' }
      ]}
      isFetching={list.isFetching}
      activeKey={activeKey}
      onChange={onChange}
      lastColMenu={lastColMenu}
    ></CardTabs>
  )
}

export default connect(
  state => {
    const {
      position,
      history = {}
    } = state.OrderReducer
    console.log(position)
    return {
      listArr: [
        position.position, position.order, history
      ]
    }
  }
)(OrderPanes)