import { Table, Menu, Dropdown, Button } from 'antd'
import styles from './OrderPanes.module.scss'
import IconFont from '../../../../utils/iconfont/iconfont'

const data = [
  {
    key: 'USOIL',
    symbol: 'USOIL',
    ticket: '1232292',
    volume: '0.01',
    cmd: 'sell',
    openPrice: '41.57/48.23',  // 即时价需实时更新
    openTime: '2020-11-18 20:50:56',
    sl: '0.00',
    tp: '0.00',
    storage: '$ 0.00',
    profit: '$ 0.15',
    closeOrder: '×'
  }
]


const OrderPanes = () => {
  const positionMenu = (
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
      title: (
        <Dropdown overlay={positionMenu} placement="bottomRight">
          <Button>
            <span>平仓</span>
            <IconFont type="iconDD" className="iconDD" />
          </Button>
        </Dropdown>
      ),
      dataIndex: 'closeOrder',
      key: 'closeOrder',
      render: () => {

      }
    },
  ]

  return (
    <Table
      className={styles.orderX}
      dataSource={data}
      columns={getColumns()}
      pagination={false}
    />
  )
}

export default OrderPanes