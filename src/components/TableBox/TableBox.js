
import { Table } from 'antd'
import IconFont from '../../utils/iconfont/iconfont'
import './TableBox.scss'
// import QuoteTr from '../../pages/MainPage/components/QuoteTr/QuoteTr.js'

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
    title: '调查',
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
  }
]

function TableBox ({ data,expandedRowRender}) {
  
  console.log("=======TableBox收到的数据：", data)
  return (
    <Table
      columns={columns} 
      dataSource={data} 
      pagination={false}
      sticky={true}
      rowClassName={(record, index) => index % 2 ? '' : 'dark-row'}
      expandIconAsCell={false}
      expandIconColumnIndex={-1}
      expandedRowClassName={(record, index) => 'quote-expand-tr'}
      expandable={{
        expandedRowRender: record => expandedRowRender
      }}
      expandRowByClick={true}
    />
  )
}

export default TableBox