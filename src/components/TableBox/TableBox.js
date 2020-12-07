
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
  },
  {
    key: '7',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659',
    desc: '展开内容'
  },
  {
    key: '8',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '9',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '10',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659',
    desc: '展开内容'
  },
  {
    key: '11',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '12',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '13',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659',
    desc: '展开内容'
  },
  {
    key: '14',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '15',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '16',
    symbol: 'AUDUSD',
    spread: '-0.00%',
    sell: '0.72631',
    buy: '0.72659',
    desc: '展开内容'
  },
  {
    key: '17',
    symbol: 'EURGBP',
    spread: '-0.02%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '18',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
  {
    key: '19',
    symbol: 'GBPAUD',
    spread: '+0.03%',
    sell: '0.89221',
    buy: '0.89244',
    desc: '展开内容'
  },
]

function TableBox (props) {
  const expandedRowRender = props.expandedRowRender
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