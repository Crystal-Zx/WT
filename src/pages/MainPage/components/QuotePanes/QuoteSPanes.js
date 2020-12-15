import { Button } from 'antd'
import SearchBox from '../../../../components/SearchBox/SearchBox.js'
import TableBox from '../../../../components/TableBox/TableBox.js'
import IconFont from '../../../../utils/iconfont/iconfont'
// import QuoteTr from './QuoteTr.js'
import { toDecimal } from '../../../../utils/utilFunc'

import { useEffect, useState } from 'react'
import { connect } from 'react-redux'

const QuoteSPane = (props) => {
  const { list, types, socket } = props
  // console.log("QSP render!",list)
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
    sendMessage()
    socket.on('message', onMessage)
  },[])

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
    data = data.data
    for(var item of trData) {
      if(item.symbol === data.symbol) {
        item.isUp = item.buy ? data.ask > item.buy : 1
        item.buy = toDecimal(data.ask, data.digits)
        item.sell = toDecimal(data.bid, data.digits)
        item.spread = toDecimal((data.ask - data.bid) * 100, 2) + "%"
        break
      }
    }
    setTrData(trData.concat([]))
  }  

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
      ></TableBox>
    </div>
  )
}

export default connect(
  state => ({
    socket: state.MainReducer.initSocket
  })
)(QuoteSPane)