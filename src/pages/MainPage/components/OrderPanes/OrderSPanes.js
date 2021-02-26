import React from 'react'
import { Table, Menu, Dropdown, Button, Badge } from 'antd'
import IconFont from '../../../../utils/iconfont/iconfont'
import EditOrderPop from './EditOrderPop'
import { getCmdArr, toDecimal } from '../../../../utils/utilFunc'

const OrderSPanes = ({ data, type, onShowConfirmForSingle, onShowConfirmForAll }) => {
  
  let { list, isFetching } = data
  // console.log("====OrderSPanes render", list)
  
  // 表头平仓
  // --- 获取对应平仓/删除项的订单号
  const getTickets = (type) => {
    let filterList
    switch(type) {
      case 0:
        return list.map(item => item.ticket)
      case 1:
        filterList = list.filter(item => item.profit >= 0 )
        return filterList.map(item => item.ticket)
      case 2:
        filterList = list.filter(item => item.profit < 0 )
        return filterList.map(item => item.ticket)
      case 3:
        return list.map(item => item.ticket)
      default: return []
    }
  }
  let getTicketsFor0 = getTickets(0),     // 平仓所有头寸
      getTicketsFor1 = getTickets(1),     // 平仓盈利头寸
      getTicketsFor2 = getTickets(2),     // 平仓亏损头寸
      getTicketsForOrder = getTickets(3)  // 删除全部挂单

  // --- 表头下拉框内容
  const lastColMenu = (
    <Menu>
      <Menu.Item 
        onClick={() => onShowConfirmForAll(getTicketsFor0)}
        disabled={!getTicketsFor0 || !getTicketsFor0.length}
      >
        <>对所有头寸进行平仓</>
      </Menu.Item>
      <Menu.Item 
        onClick={() => onShowConfirmForAll(getTicketsFor1)}
        disabled={!getTicketsFor1 || !getTicketsFor1.length}
      >
        <>对盈利头寸进行平仓（净利）</>
      </Menu.Item>
      <Menu.Item 
        onClick={() => onShowConfirmForAll(getTicketsFor2)}
        disabled={!getTicketsFor2 || !getTicketsFor2.length}
      >
        <>对亏损头寸进行平仓（净利）</>
      </Menu.Item>
    </Menu>
  )
  const isFoldRow = (key) => { // 非折叠行->0；折叠行->1
    return !isNaN(Number(key))
  }
  // 持仓单columns配置项
  const getColumns = () => {
    return [
      {
        title: '品种',
        dataIndex: 'symbol',
        key: 'symbol',
        width: '20.02%',
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
        dataIndex: 'cmdForCh',
        key: 'cmdForCh',
        width: '7.46%',
        align: 'left'
      },
      {
        title: `${Number(type) === 0 ? "开仓" : "挂单"}价/即时价`,
        dataIndex: 'open_price',
        key: 'openPrice',
        width: '13.12%',
        align: 'left',
        render: (open_price, item) => {
          // 数据里未提供小数位数，暂时如此计算
          const op = open_price + "",
                cp = item.close_price + ""
          const opDigits = op.length - op.indexOf(".") - 1,
                cpDigits = cp.length - cp.indexOf(".") - 1
          const digits = Math.min(opDigits, cpDigits)
          return (
            <>
              <span className="op-openprice">{toDecimal(open_price, digits)}</span>
              <span>{toDecimal(item.close_price, digits)}</span>
            </>
          ) 
        }
      },
      {
        title: '开仓时间',
        dataIndex: 'open_time',
        key: 'openTime',
        width: '12.06%',
        align: 'left'
      },
      {
        title: '止盈',
        dataIndex: 'tp',
        key: 'tp',
        width: '8.98%',
        align: 'left',
        render: (tp, item) => {
          return (<>
            <span>{tp}</span>
            {
              (isFoldRow(item.key) || (!isFoldRow(item.key) && item.ticket.length <= 1))
              &&
              <EditOrderPop data={item} />
            }
          </>)
        }
      },
      {
        title: '止损',
        dataIndex: 'sl',
        key: 'sl',
        width: '8.09%',
        align: 'left',
        render: (sl, item) => {
          // console.log("====getColumns sl render")
          return (<>
            <span>{sl}</span>
            {
              (isFoldRow(item.key) || (!isFoldRow(item.key) && item.ticket.length <= 1))
              &&
              <EditOrderPop data={item} />
            }
          </>)
        }
      },
      {
        title: '隔夜利息',
        dataIndex: 'storage',
        key: 'storage',
        width: '7.94%',
        align: 'center'
      },
      {
        title: '盈利',
        dataIndex: 'profit',
        key: 'profit',
        width: '7.95%',
        align: 'center',
        render: profit => {
          const className = profit > 0 ? 'color-up' : 'color-down'
          return <span className={className}>
            {profit}
            {/* {profit > 0 ? '$ ' + profit : '-$ ' + Math.abs(profit)} */}
          </span>
        }
      },
      {
        title: () => {
          if(Number(type) === 0) {
            return (
              <Dropdown overlay={lastColMenu} placement="bottomRight">
                <Button type="primary">
                  <span>{Number(type) === 0 ? "平仓" : "取消"}</span>
                  <IconFont type="iconDD" className="iconDD" />
                </Button>
              </Dropdown>
            )
          } else if(Number(type) === 1) {
            return (
              <Button 
                type="primary" 
                className="op-btn-closeOrder"
                disabled={!getTicketsForOrder || !getTicketsForOrder.length}
                onClick={() => onShowConfirmForAll(getTicketsForOrder)}
              >
                全部删除
              </Button>
            )
          }
        },
        dataIndex: 'closeOrder',
        key: 'closeOrder',
        className: 'op-cell-closeOrder',
        align: 'right',
        render: (closeOrder,item) => {
          return (
            ((!isFoldRow(item.key) && item.ticket.length <= 1) || isFoldRow(item.key))
            &&
            <Button 
              type="default"
              className="op-btn-close"
              onClick={() => onShowConfirmForSingle(item)}
            >
              <IconFont 
                type="iconClose" 
                className="op-icon-close"
              />
            </Button>
          )
        }
      }
    ]
  }
  // 历史订单columns配置项
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
      dataIndex: 'cmdForCh',
      key: 'cmdForCh',
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
      align: 'center',
      render: profit => {
        const className = profit > 0 ? 'color-up' : 'color-down'
        return <span className={className}>{toDecimal(profit, 2)}</span>
      }
    }
  ]
  // 将扁平化数据格式化为页面渲染所需格式
  const handleList = (list) => {
    if(list.length) {
      const cmdArr = getCmdArr()
      let data = [], dataObj = {}
      for(var p of list) {
        p.key = p.ticket
        p.cmdForCh = cmdArr[p.cmd]
        p.profit = Number(toDecimal(p.profit, 2))
        if(!dataObj[p.symbol]) {
          dataObj[p.symbol] = new Array(p)
        } else {
          dataObj[p.symbol].push(p)
        }
      }
      for(var symbol in dataObj) {
        const isMoreThan1 = dataObj[symbol].length > 1
        data.push({
          key: symbol,
          symbol: symbol,
          ticket: dataObj[symbol].map(item => `${item.ticket}`),
          volume: toDecimal(dataObj[symbol].reduce((prev, currItem) => prev + currItem.volume,0), 2),
          cmd: isMoreThan1 ? '' : dataObj[symbol][0].cmd,
          cmdForCh: isMoreThan1 ? '' : dataObj[symbol][0].cmdForCh,
          open_price: isMoreThan1 ? '' : dataObj[symbol][0].open_price,
          close_price: isMoreThan1 ? '' : dataObj[symbol][0].close_price,  // 即时价需实时更新
          open_time: isMoreThan1 ? '' : dataObj[symbol][0].open_time,
          sl: isMoreThan1 ? '' : dataObj[symbol][0].sl,
          tp: isMoreThan1 ? '' : dataObj[symbol][0].tp,
          storage: toDecimal(dataObj[symbol].reduce((prev, currItem) => prev + currItem.storage,0), 2),
          profit: toDecimal(dataObj[symbol].reduce((prev, currItem) => prev + currItem.profit,0), 2),
          commission: toDecimal(dataObj[symbol].reduce((prev, currItem) => prev + currItem.commission,0), 2),
          children: isMoreThan1 ? dataObj[symbol] : []
        })
      }
      return data
    }
  }
  // 处理历史订单
  const handleHisList = (list) => {
    return list.map(item => {
      return ({
        ...item,
        key: item.ticket
      })
    })
  }
  
  return (
    <Table
      dataSource={type < 2 ? handleList(list) : handleHisList(list)}
      loading={isFetching}
      columns={type < 2 ? getColumns() : getHistoryCol()}
      pagination={false}
      expandable={{
        expandRowByClick: true,
        expandIconAsCell: false,
        expandIconColumnIndex: -1,  // 自定义展开按钮的列顺序，-1 时不展示
      }}
      scroll={{ y: 'calc(100% - 40px)'}}
    />
  )
}

// const areEqual = (prevProps, nextProps) => {
//   const prevData = prevProps.data,
//         nextData = nextProps.data
//   // console.log("====OSP areEqual", prevData.list, nextData.list,JSON.stringify(prevData.list) === JSON.stringify(nextData.list))
//   if(JSON.stringify(prevData.list) === JSON.stringify(nextData.list) && prevData.isFetching === nextData.isFetching) {
//     return true
//   } else {
//     return false
//   }
// }

export default OrderSPanes