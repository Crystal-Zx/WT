
import { Table } from 'antd'
import IconFont from '../../utils/iconfont/iconfont'
import QuoteTr from '../../pages/MainPage/components/QuotePanes/QuoteTr'
import styles from './TableBox.module.scss'
import { useState,useEffect } from 'react'
import SymbolInfoModal from '../SymbolInfoModal/SymbolInfoModal'
import { useIntl } from 'react-intl'

// 目前仅用于报价板块数据
function TableBox (props) {
  const { data, addToKLine, isExpandAll } = props  // isLogin
  // console.log("====TableBox RENDER", data)
  const [expandedRows, setExpandedRows] = useState()
  const [visible, setVisible] = useState(false)
  const [symbol, setSymbol] = useState(null)
  const intl = useIntl()

  const renderContent = (val, row, index, type) => {
    // console.log("====renderContent", val, row)
    const obj = {
      children: val || '---',
      props: {}
    }
    if(expandedRows && expandedRows.includes(row.symbol)) {
      obj.props.colSpan = type === 'ask' ? 3 : 0
      obj.children = (
        <>
          <div className="qsp-symbol-operate">
            <>
              <IconFont 
                type="iconInfo"
                className="icon-info"
                onClick={(e) => {
                  e.stopPropagation()
                  setSymbol(row.symbol)
                  setVisible(true)
                  // getSIMJSX(row.symbol)
                }}
              />
              {/* <SymbolInfoModal
                symbol={row.symbol}
                visible={visible}
                onCancel={() => setVisible(false) }
              /> */}
            </>
            <IconFont 
              type="iconKLine"
              className="icon-kline"
              onClick={(e) => {
                if(!Number(row.ask)) {
                  e.stopPropagation()
                  return
                }
                addToKLine(e,row)
                // addToKLine(e,row.symbol, row.digits)
              }}
              disabled={!Number(row.ask)}
            />
            {/* <IconFont 
              type="iconFavorite"
              className="icon-favorite"
              onClick={addToFavorite}
            /> */}
          </div>
        </>
      )
    }
    return obj
  }
  const getColumns = () => [
    {
      title: intl.formatMessage({
        id: "quote.subTabName.symbol",
        defaultMessage: "品种"
      }),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '38.68%',
      render: (symbol, row) => {
        // console.log(symbol, row)
        return (
          <>
            <IconFont type="iconDown" className="iconDown" />
            <span style={{ marginLeft: '8px' }}>{intl.locale === 'zh' ? row.cn_name : symbol }</span>
          </>
        )
      }
    },
    {
      title: intl.formatMessage({
        id: "quote.subTabName.spread",
        defaultMessage: "调查"
      }),
      dataIndex: 'spread',
      key: 'spread',
      width: '21.5%',
      align: 'center',
      textWrap: 'word-break',
      ellipsis: true,
      render: (...args) => renderContent(...args, 'spread')
    },
    {
      title: intl.formatMessage({
        id: "quote.subTabName.bid",
        defaultMessage: "卖"
      }),
      dataIndex: 'bid',
      key: 'bid',
      align: 'center',
      render: (...args) => renderContent(...args, 'bid')
    },
    {
      title: intl.formatMessage({
        id: "quote.subTabName.ask",
        defaultMessage: "买"
      }),
      dataIndex: 'ask',
      key: 'ask',
      align: 'center',
      render: (...args) => renderContent(...args, 'ask')
    }
  ]
  const getSymbolCnName = symbol => data.filter(item => item.symbol === symbol)[0].cn_name

  useEffect(() => {
    const changeExpandedRowKeys = () => {
      const _expandedRows = isExpandAll ? data.map(item => item.key) : []
      return _expandedRows
    }
    setExpandedRows(changeExpandedRowKeys())
  }, [isExpandAll])
  

  return (
    <>
      <Table
        className={styles['table-x']}
        columns={getColumns()}
        dataSource={data}
        pagination={false}
        sticky={true}
        rowClassName={(record, index) => {
          let className = ''
          className += record.isUp ? 'quote-up ' : 'quote-down '
          className += index % 2 ? '' : 'dark-row'
          return className
        }}
        expandable={{
          expandRowByClick: false,
          expandIconAsCell: false,
          expandIconColumnIndex: -1,
          expandedRowKeys: expandedRows,  // 展开的行
          expandedRowClassName: (record, index) => 'quote-expand-tr ' + (record.isUp ? 'quote-up' : 'quote-down'),
          expandedRowRender: record => <QuoteTr data={record} />,
          // onExpandedRowsChange: (expandedRows) => {
          //   console.log(expandedRows)
          //   setExpandedRows(expandedRows)
          // }
        }}
        onRow={record => {
          return {
            onClick: event => {
              const isExpanded = expandedRows.includes(record.symbol)
              if(isExpanded) {
                setSymbol(null)
                setExpandedRows(expandedRows.filter(item => item !== record.symbol))
              } else {
                expandedRows.push(record.symbol)
                setExpandedRows([...new Set(expandedRows)])
              }
            },
            onDoubleClick: event => {
              addToKLine(event, record)
              // addToKLine(event, record.symbol, record.digits)
            }
          }
        }}
      />
      { visible && symbol &&
        <SymbolInfoModal
          symbol={symbol}
          symbolForCh={getSymbolCnName(symbol)}
          visible={visible}
          onCancel={() => setVisible(false) }
        />
      }
    </>
  )
}

export default TableBox