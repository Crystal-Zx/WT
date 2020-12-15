
import { Table } from 'antd'
import IconFont from '../../utils/iconfont/iconfont'
import QuoteTr from '../../pages/MainPage/components/QuotePanes/QuoteTr'
import './TableBox.scss'
import { useState } from 'react'

function TableBox (props) {
  const { data } = props
  const [expandedRows, setExpandedRows] = useState()

  const renderContent = (val, row, index, type) => {
    const obj = {
      children: val,
      props: {}
    }
    if(expandedRows && expandedRows.includes(row.symbol)) {
      obj.props.colSpan = type === 'buy' ? 3 : 0
      obj.children = (
        <div style={
          {display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: 25}
        }>
          <IconFont type="iconKLine" className="iconKLine" />
          <IconFont type="iconFavorite" className="iconFavorite" />
        </div>
      )
    }
    return obj
  }
  
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
      key: 'spread',
      render: (...args) => renderContent(...args, 'spread')
    },
    {
      title: '卖',
      dataIndex: 'sell',
      key: 'sell',
      render: (...args) => renderContent(...args, 'sell')
    },
    {
      title: '买',
      dataIndex: 'buy',
      key: 'buy',
      render: (...args) => renderContent(...args, 'buy')
    }
  ]
  return (
    <Table
      columns={columns} 
      dataSource={data} 
      pagination={false}
      sticky={true}
      rowClassName={(record, index) => {
        let className = ''
        // console.log(record)
        if(record.isUp) {
          className += 'quote-up '
        } else {
          className += 'quote-down '
        }
        className += index % 2 ? '' : 'dark-row'
        return className
      }}
      expandRowByClick={true}
      onExpandedRowsChange={(expandedRows) => setExpandedRows(expandedRows)}
      expandIconAsCell={false}
      expandIconColumnIndex={-1}
      expandedRowClassName={(record, index) => 'quote-expand-tr'}
      expandable={{
        expandedRowRender: record => { // record 是每一行的数据源
          return <QuoteTr data={record} />
        }
      }}
    />
  )
}

export default TableBox