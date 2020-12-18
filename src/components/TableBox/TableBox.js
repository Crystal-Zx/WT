
import { Table } from 'antd'
import IconFont from '../../utils/iconfont/iconfont'
import QuoteTr from '../../pages/MainPage/components/QuotePanes/QuoteTr'
import styles from './TableBox.module.scss'
import { useState,useEffect } from 'react'

function TableBox (props) {
  const { data, addToFavorite, addToKLine, isExpandAll } = props
  
  const changeExpandedRowKeys = () => {
    const _expandedRows = isExpandAll ? data.map(item => item.key) : []
    return _expandedRows
  }
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
          <IconFont 
            type="iconKLine"
            className="icon-kline"
            onClick={(e) => 
              addToKLine(e,row.symbol, row.sell.split(".")[1].length)
            }
          />
          <IconFont 
            type="iconFavorite"
            className="icon-favorite"
            onClick={addToFavorite}
          />
        </div>
      )
    }
    return obj
  }
  const getColumns = () => [
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

  useEffect(() => {
    setExpandedRows(changeExpandedRowKeys())
  }, [isExpandAll])
  
  const [expandedRows, setExpandedRows] = useState()

  return (
    <Table
      className={styles.tableBox}
      columns={getColumns()}
      dataSource={data} 
      scroll={{ y: 'calc(536 - 26)' }}
      pagination={false}
      sticky={true}
      rowClassName={(record, index) => {
        let className = ''
        className += record.isUp ? 'quote-up ' : 'quote-down '
        className += record.isShow ? '' : 'hide '
        className += index % 2 ? '' : 'dark-row'
        return className
      }}
      expandedRowKeys={expandedRows}  // 展开的行
      expandRowByClick={true}
      onExpandedRowsChange={(expandedRows) => setExpandedRows(expandedRows)}
      expandIconAsCell={false}
      expandIconColumnIndex={-1}
      expandedRowClassName={(record, index) => 'quote-expand-tr'}
      expandable={{
        expandedRowRender: record => { // record 是每一行的数据源
          const _record = Object.assign({}, record, {
            spread: record.spread.replace("%",'')
          })
          return <QuoteTr data={_record} />
        }
      }}
    />
  )
}

export default TableBox