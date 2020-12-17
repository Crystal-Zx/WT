import { Table } from 'antd'
import styles from './OrderPanes.module.scss'

const OrderPanes = () => {
  const getColumns = () => [
    {
      title: '品种',
      dataIndex: 'symbol',
      key: 'symbol'
    },
    {
      title: '订单',
      dataIndex: 'ticket',
      key: 'ticket'
    },
    {
      title: '手数',
      dataIndex: 'volume',
      key: 'volume'
    },
    {
      title: '方向',
      dataIndex: 'cmd',
      key: 'cmd'
    },
    {
      title: '开仓价/即时价',
      dataIndex: 'openPrice',
      key: 'openPrice'
    },
    {
      title: '开仓时间',
      dataIndex: 'openTime',
      key: 'openTime'
    },
    {
      title: '止损',
      dataIndex: 'sl',
      key: 'sl'
    },
    {
      title: '止盈',
      dataIndex: 'tp',
      key: 'tp'
    },
    {
      title: '隔夜利息',
      dataIndex: 'storage',
      key: 'storage'
    },
    {
      title: '盈利',
      dataIndex: 'profit',
      key: 'profit'
    },
    {
      title: '平仓',
      dataIndex: 'closeOrder',
      key: 'closeOrder'
    },
  ]

  return (
    <Table
      className={styles.orderX}
      columns={getColumns()}
    />
  )
}

export default OrderPanes