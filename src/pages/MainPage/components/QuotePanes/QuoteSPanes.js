import { Button } from 'antd'
import SearchBox from '../../../../components/SearchBox/SearchBox.js'
import TableBox from '../../../../components/TableBox/TableBox.js'
import IconFont from '../../../../utils/iconfont/iconfont'

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { addToKLine } from '../../MainAction'

const QuoteSPane = (props) => {
  // console.log("====QSP render", props)
  const { slist, group, addToKLine } = props
  const list = slist.filter(item => item.group === group)
  const currType = list.map(item => item.name)
  
  // const [trData, setTrData] = useState(list)
  const [isExpandAll, setIsExpandAll] = useState(false)

  // const sendMessage = () => {
  //   const args = currType.join(".")
  //   // // 获取报价信息
  //   // socket.send({
  //   //   "cmd": "quote",
  //   //   "args": [`${args}`]
  //   // })
  //   socket.send({
  //     "cmd": "mini",
  //     "args": [`${args}`]
  //   })
  // }
  // const onMessage = (data) => {
  //   if(data.type === 'quote') {
  //     data = data.data
  //     for(var item of list) {
  //       if(item.symbol === data.symbol) {
  //         item.isUp = item.buy ? data.ask > item.buy : 1
  //         item.buy = toDecimal(data.ask, data.digits)
  //         item.sell = toDecimal(data.bid, data.digits)
  //         item.spread = toDecimal((data.ask - data.bid) * 100, data.digits < 2 ? data.digits : 2) + "%"
  //         break
  //       }
  //     }
  //     // setTrData(trData.concat([]))
  //   }
  //   else if(data.type === 'mini') {
  //     data = data.data
  //     // 计算每个货币对的高点、低点及（高点 - 低点）/低点
  //     for(let item of data) {
  //       if(item.ticks && item.ticks.length > 0) {
  //         item.high = Math.max(...item.ticks)
  //         item.low = Math.min(...item.ticks)
  //         item.per = Math.floor((item.high - item.low) / item.low * 10000) / 100 + '%'
  //       }
  //     }
  //     // 将数据填到trData中以便更新视图
  //     for(var item of data) {
  //       if(currType.includes(item.symbol)) {
  //         for(var trd of list) {
  //           if(trd.symbol === item.symbol) {
  //             trd.high = item.high
  //             trd.low = item.low
  //             trd.per = item.per
  //             break
  //           }
  //         }
  //       }
  //     }
  //     // setTrData(trData.concat([]))
  //   }
  // }
  const addToFavorite = (e) => {
    e.stopPropagation()
    console.log("addToFavorite",e)
  }
  // const onSearch = (value) => {
  //   const _trData = trData.map(
  //     item => item.isShow = item.key.toUpperCase().indexOf(value.toUpperCase()) === -1 ? 0 : 1
  //     // item => item.key.toUpperCase().indexOf(value.toUpperCase()) !== -1
  //   )
  //   setTrData(_trData)
  // }
  const onChangeExpand = () => {
    setIsExpandAll(!isExpandAll)
  }

  return (
    <>
      <div className="qsp-search-x">
        <SearchBox 
          // onSearch={onSearch}
        />
        <Button 
          type="primary" 
          className="qsp-btn-fold"
          onClick={onChangeExpand}
        >
          <IconFont type="iconFold" className="icon-fold" />
        </Button>
      </div>
      <TableBox
        data={list.filter(item => item.isShow)}
        addToFavorite={addToFavorite}
        addToKLine={addToKLine}
        isExpandAll={isExpandAll}
      ></TableBox>
    </>
  )
}
// const areEqual = (prevProps, nextProps) => {
//   console.log(JSON.stringify(prevProps.list), JSON.stringify(nextProps.list), JSON.stringify(prevProps.list) === JSON.stringify(nextProps.list))
//   if(JSON.stringify(prevProps.list) === JSON.stringify(nextProps.list)) {
//     return true
//   } else {
//     return false
//   }
// }

export default connect(
  state => {
    const { symbolList } = state.QuoteReducer
    return {
      slist: symbolList.list
    }
  },
  dispatch => {
    return {
      addToKLine: (e, symbol, digits) => {
        e.stopPropagation()
        dispatch(addToKLine({ symbol, digits }))
      }
    }
  }
)(QuoteSPane)