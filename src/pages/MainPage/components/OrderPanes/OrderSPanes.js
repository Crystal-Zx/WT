import { Table, Menu, Dropdown, Button, Badge } from 'antd'
import IconFont from '../../../../utils/iconfont/iconfont'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { toDecimal } from '../../../../utils/utilFunc'


const OrderSPanes = ({ data, lastColMenu, type, socket }) => {
  const { list, isFetching } = data
  const [trData, setTrData] = useState(list)

  const isFoldRow = (key) => { // 非折叠行->0；折叠行->1
    return !isNaN(Number(key))
  }
  const getColumns = () => [
    {
      title: '品种',
      dataIndex: 'symbol',
      key: 'symbol',
      width: '23.02%',
      align: 'left',
      render: (symbol, item) => {
        return isFoldRow(item.key) ? 
          <span>{item.key}</span> :
          (
            <>
              {
                item.ticket.length > 1 &&
                <>
                  <span className="op-rkey-badge">{item.key}</span>
                  <Badge 
                    size="small"
                    count={item.ticket.length}
                    className="op-badge-ticket"
                  />
                </>
              }
              {
                item.ticket.length <= 1 &&
                <>
                  <span className="op-rkey-ticket">{item.key}</span>
                  <span>{item.ticket[0]}</span>
                </>
              }
            </>
          )
      }
    },
    {
      title: '手数',
      dataIndex: 'volume',
      key: 'volume',
      width: '7.94%',
      align: 'left'
    },
    {
      title: '方向',
      dataIndex: 'cmd',
      key: 'cmd',
      width: '7.46%',
      align: 'left'
    },
    {
      title: `${type == 0 ? "开仓" : "挂单"}价/即时价`,
      dataIndex: 'open_price',
      key: 'openPrice',
      width: '13.12%',
      align: 'left',
      render: (open_price, item) => {
        return (
          <>
            <span className="op-openprice">{open_price}</span>
            <span>{item.close_price}</span>
          </>
        ) 
      }
    },
    {
      title: '开仓时间',
      dataIndex: 'openTime',
      key: 'openTime',
      width: '12.06%',
      align: 'left'
    },
    {
      title: '止损',
      dataIndex: 'sl',
      key: 'sl',
      width: '7.09%',
      align: 'left',
      render: (sl, item) => {
        return (<>
          <span>{sl}</span>
          {
            (isFoldRow(item.key) || (!isFoldRow(item.key) && item.ticket.length <= 1))
            &&
            <IconFont type="iconEdit" className="op-icon-edit" />
          }
        </>)
      }
    },
    {
      title: '止盈',
      dataIndex: 'tp',
      key: 'tp',
      width: '6.98%',
      align: 'left',
      render: (tp, item) => {
        return (<>
          <span>{tp}</span>
          {
            (isFoldRow(item.key) || (!isFoldRow(item.key) && item.ticket.length <= 1))
            &&
            <IconFont type="iconEdit" className="op-icon-edit" />
          }
        </>)
      }
    },
    {
      title: '隔夜利息',
      dataIndex: 'storage',
      key: 'storage',
      width: '7.94%',
      align: 'left'
    },
    {
      title: '盈利',
      dataIndex: 'profit',
      key: 'profit',
      width: '7.95%',
      align: 'left',
      render: profit => {
        const className = profit > 0 ? 'color-up' : 'color-down'
        return <span className={className}>
          {profit > 0 ? '$ ' + profit : '-$ ' + Math.abs(profit)}
        </span>
      }
    },
    {
      title: (
        <Dropdown overlay={lastColMenu} placement="bottomRight">
          <Button>
            <span>{type == 0 ? "平仓" : "取消"}</span>
            <IconFont type="iconDD" className="iconDD" />
          </Button>
        </Dropdown>
      ),
      dataIndex: 'closeOrder',
      key: 'closeOrder',
      className: 'op-cell-closeOrder',
      align: 'center',
      render: () => {
        return <IconFont type="iconClose" className="op-icon-close" />
      }
    }
  ]
  const getHistoryCol = () => [
    {
      title: '品种',
      dataIndex: 'symbol',
      key: 'symbol',
      width: '8.4%'
    },
    {
      title: '订单',
      dataIndex: 'ticket',
      key: 'ticket',
      width: '10%'
    },
    {
      title: '手数',
      dataIndex: 'volume',
      key: 'volume',
      width: '7.94%'
    },
    {
      title: '方向',
      dataIndex: 'cmd',
      key: 'cmd',
      width: '9.06%'
    },
    {
      title: '开仓价/平仓价',
      dataIndex: 'open_price',
      key: 'openPrice',
      width: '18.14%',
      render: (open_price, item) => {
        return (
          <>
            <span className="op-openprice">{open_price}</span>
            <span>{item.close_price}</span>
          </>
        ) 
      }
    },
    {
      title: '开仓时间',
      dataIndex: 'open_time',
      key: 'openTime',
      width: '15.06%'
    },
    {
      title: '平仓时间',
      dataIndex: 'close_time',
      key: 'openTime',
      width: '14.06%'
    },
    {
      title: '隔夜利息',
      dataIndex: 'storage',
      key: 'storage',
      width: '6.94%',
      align: 'center'
    },
    {
      title: '盈利',
      dataIndex: 'profit',
      key: 'profit',
      align: 'center'
    }
  ]

  useEffect(() => {
    if(list && list.length > 0) {
      setTrData(list)
    }
  }, [list])
  useEffect(() => {
    if(Object.keys(socket).length && trData && trData.length) {  // && socket.checkOpen()
      socket.on("order",onMessage)
    }
  }, [Object.keys(socket).length, trData])

  const isBuy = (type,filter = ["buy","buylimit","buystop"]) => {
    for(var _type of filter) {
      if(type.toLowerCase() === _type.toLowerCase()) return true
    }
    return false
  }

  const onMessage = (data) => {
    if(data.type === 'quote' && !Number(type)) {  // 理论上说应该没必要再判断一次，不过保险起见
      data = data.data
      // console.log(data)
      for(let trd of trData) {
        if(trd.symbol !== data.symbol) continue
        if(trd.children.length) {
          // 遍历处理同一货币对下的不同订单的即时价&盈利值
          for(let cd of trd.children) {
            if(cd.symbol === data.symbol) {
              let flag
              if(isBuy(cd.cmd)) {  // 多单 buy
                cd.close_price = data.bid
                flag = 1
              } else {  // 空单 sell
                cd.close_price = data.ask
                flag = -1
              }
              // 10000 -> data.contract_size；0.00965372 -> data.trans_price
              cd.profit = ((cd.close_price - cd.open_price) * cd.volume * 100000 * 0.00965372 * flag).toFixed(2)
            }
          }
          // 更新该货币对下的盈利值
          trd.profit = (trd.children.reduce((prev, currItem) => prev + Number(currItem.profit),0)).toFixed(2)
        } else {
          let flag
          if(isBuy(trd.cmd)) {  // 多单 buy
            trd.close_price = data.bid
            flag = 1
          } else {  // 空单 sell
            trd.close_price = data.ask
            flag = -1
          }
          trd.profit = ((trd.close_price - trd.open_price) * trd.volume * 100000 * 0.00965372 * flag).toFixed(2)
        }
      }
      setTrData(trData.concat([]))
    }
  }
  
  return (
    <Table
      dataSource={trData}
      loading={isFetching}
      columns={type < 2 ? getColumns() : getHistoryCol()}
      pagination={false}
      expandRowByClick={true}
      expandIconAsCell={false}
      expandIconColumnIndex={-1}
      scroll={{ y: 'calc(100% - 40px)'}}
    />
  )
}

export default connect(
  state => {
    const socket = state.MainReducer.initSocket
    return {
      socket
    }
  }
)(OrderSPanes)