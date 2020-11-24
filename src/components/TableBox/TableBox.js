
import { Table } from 'antd'
import { useState, useEffect } from 'react'
import IconFont from '../../utils/iconfont/iconfont'
import './TableBox.scss'
import QuoteTr from '../QuoteTr/QuoteTr.js'

const columns = [
  {
    title: '品种',
    dataIndex: 'symbol',
    key: 'symbol',
    render: symbol => (
      <>
        <IconFont type="iconDown" className="iconDown" />
        <span style={{ marginLeft: '8px' }}>{symbol}</span>
      </>
    )
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
    buy: '0.72659',
    desc: '展开内容'
  },
  {
    key: '2',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '3',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '4',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659',
    desc: '展开内容'
  },
  {
    key: '5',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '6',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  }
]

export default function TableBox () {
  const [sh, setSh] = useState(0)
  useEffect(() => {
    setSh(document.getElementsByClassName("ant-table-wrapper")[0].clientHeight - 26)
  })
  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      pagination={false}
      scroll={{ y: sh }}
      sticky={true}
      rowClassName={(record, index) => index % 2 ? '' : 'dark-row'}
      expandIconAsCell={false}
      expandIconColumnIndex={-1}
      expandedRowClassName={(record, index) => 'quote-expand-tr'}
      expandable={{
        expandedRowRender: record => <QuoteTr quote={record} />
      }}
      expandRowByClick={true}
    />
  )
}