import { Button } from 'antd'
import SearchBox from '../../../../components/SearchBox/SearchBox.js'
import TableBox from '../../../../components/TableBox/TableBox.js'
import IconFont from '../../../../utils/iconfont/iconfont'
// import QuoteTr from './QuoteTr.js'
import { toDecimal } from '../../../../utils/utilFunc'

import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { addToKLine } from '../../MainAction'

const QuoteSPane = (props) => {
  const { list, types, socket, addToKLine } = props
  const initTrData = () => {
    return list.map((item) => {
      return {
        key: item.symbol,
        symbol: item.symbol,
        spread: '---',
        sell: '---',
        buy: '---',
        desc: '展开内容'
      }
    })
  }
  
  const [trData, setTrData] = useState(initTrData())
  
  useEffect(() => {
    initTrData()
    // sendMessage()
    // socket.onMessage = data => {
    //   const types = ['quote']
    //   data = JSON.parse(data)
    //   // console.log("QSP onMsg:", types.includes(data.type),data.type)
    //   if(types.includes(data.type))
    //     return onMessage(data)
    // }
    socket.on("quote", onMessage)
  },[])
  useEffect(() => {
    console.log("types changed:", types, types.length)
    sendMessage()
  }, [types.length])

  const sendMessage = () => {
    const args = types.join(".")
    // 获取报价信息
    socket.send({
      "cmd": "quote",
      "args": [`${args}`]
    })
  }
  const onMessage = (data) => {
    if(data.type !== "quote") {
      return
    }
    // console.log("QSP func onMsg:", data)
    data = data.data
    for(var item of trData) {
      if(item.symbol === data.symbol) {
        item.isUp = item.buy ? data.ask > item.buy : 1
        item.buy = toDecimal(data.ask, data.digits)
        item.sell = toDecimal(data.bid, data.digits)
        item.spread = toDecimal((data.ask - data.bid) * 100, data.digits < 2 ? data.digits : 2) + "%"
        break
      }
    }
    setTrData(trData.concat([]))
  }  
  const addToFavorite = (e) => {
    e.stopPropagation()
    console.log("addToFavorite",e)
  }
  // const addToKLine = (e,symbol) => {
  //   e.stopPropagation()
  //   console.log("addToKLine",symbol)
  // }

  return (
    <div className="quote-x">
      <div className="search-container">
        <SearchBox />
        <Button type="primary" className="btn-more">
          <IconFont type="iconSquare" className="iconSquare" />
        </Button>
      </div>
      <TableBox
        data={trData}
        addToFavorite={addToFavorite}
        addToKLine={addToKLine}
      ></TableBox>
    </div>
  )
}

export default connect(
  state => ({
    socket: state.MainReducer.initSocket
  }),
  (dispatch, ownProps) => {
    return {
      addToKLine: (e, symbol, digits) => {
        e.stopPropagation()
        dispatch(addToKLine({ symbol, digits }))
      }
    }
  }
)(QuoteSPane)