import { Table, Menu, Dropdown, Button, Badge } from 'antd'
import IconFont from '../../../../utils/iconfont/iconfont'
import { toDecimal } from '../../../../utils/utilFunc'

// const data = [
//   {
//     key: 'USOIL',
//     symbol: 'USOIL',
//     ticket: ['1232292','1232293'],
//     volume: '0.01',
//     cmd: 'sell',
//     openPrice: '41.57',
//     currPrice: '48.23',  // 即时价需实时更新
//     openTime: '2020-11-18 20:50:56',
//     sl: '0.00',
//     tp: '0.00',
//     storage: '$ 0.00',
//     profit: '$ 0.15',
//     children: [
//       {
//         key: '1232292',
//         ticket: '1232292',
//         volume: '0.01',
//         cmd: 'sell',
//         openPrice: '41.57',
//         currPrice: '48.23',  // 即时价需实时更新
//         openTime: '2020-11-18 20:50:56',
//         sl: '0.00',
//         tp: '0.00',
//         storage: '$ 0.00',
//         profit: '$ 0.15'
//       },
//       {
//         key: '1232293',
//         ticket: '1232293',
//         volume: '0.01',
//         cmd: 'sell',
//         openPrice: '41.57',
//         currPrice: '48.23',  // 即时价需实时更新
//         openTime: '2020-11-18 20:50:56',
//         sl: '0.00',
//         tp: '0.00',
//         storage: '$ 0.00',
//         profit: '$ 10.34'
//       }
//     ]
//   },
//   {
//     key: 'EURUSD',
//     symbol: 'EURUSD',
//     ticket: ['1232294'],
//     volume: '0.05',
//     cmd: 'buy',
//     openPrice: '41.57',
//     currPrice: '48.23',  // 即时价需实时更新
//     openTime: '2020-11-18 20:50:56',
//     sl: '0.00',
//     tp: '0.00',
//     storage: '$ 0.00',
//     profit: '$ 20.95'
//     // children: [
//     //   {
//     //     key: '1232292',
//     //     ticket: '1232292',
//     //     volume: '0.01',
//     //     cmd: 'sell',
//     //     openPrice: '41.57',
//     //     currPrice: '48.23',  // 即时价需实时更新
//     //     openTime: '2020-11-18 20:50:56',
//     //     sl: '0.00',
//     //     tp: '0.00',
//     //     storage: '$ 0.00',
//     //     profit: '$ 0.15'
//     //   }
//     // ]
//   },
// ]


const OrderSPanes = ({ data, lastColMenu, dispatch, type }) => {

  // console.log("====OrderSPanes", data)

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
      dataIndex: 'openPrice',
      key: 'openPrice',
      width: '13.12%',
      align: 'left',
      render: (openPrice, item) => {
        return (
          <>
            <span className="op-openprice">{openPrice || item.open_price}</span>
            <span>{item.currPrice}</span>
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
      align: 'left'
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
  
  return (
    <Table
      dataSource={data.list}
      loading={data.isFetching}
      columns={type < 2 ? getColumns() : getHistoryCol()}
      pagination={false}
      expandRowByClick={true}
      expandIconAsCell={false}
      expandIconColumnIndex={-1}
      scroll={{ y: 'calc(100% - 40px)'}}
    />
  )
}

export default OrderSPanes