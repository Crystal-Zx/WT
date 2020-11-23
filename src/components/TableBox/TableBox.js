
import { Table } from 'antd'
import { useState, useEffect } from 'react'
import './TableBox.scss'

const columns = [
  {
    title: '品种',
    dataIndex: 'symbol',
    key: 'symbol'
  },
  {
    title: '点差',
    dataIndex: 'spread',
    key: 'spread'
  },
  {
    title: '卖',
    dataIndex: 'sell',
    key: 'sell'
  },
  {
    title: '买',
    dataIndex: 'buy',
    key: 'buy'
  }
]

const data = [
  {
    key: '1',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659'
  },
  {
    key: '2',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244'
  },
  {
    key: '3',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244'
  },
  {
    key: '4',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659'
  },
  {
    key: '5',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244'
  },
  {
    key: '6',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244'
  },
  {
    key: '7',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659'
  },
  {
    key: '8',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244'
  },
  {
    key: '9',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244'
  },
  {
    key: '10',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244'
  },
]

export default function TableBox () {
  const [sh, setSh] = useState(0)
  useEffect(() => {
    setSh(document.getElementsByClassName("ant-table-wrapper")[0].clientHeight - 26)
  })
  console.log(sh)
  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      pagination={false}
      scroll={{ y: sh }}
      sticky={true}
    />
  )
}