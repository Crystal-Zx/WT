import { Button } from 'antd'
import SearchBox from '../../../../components/SearchBox/SearchBox.js'
import TableBox from '../../../../components/TableBox/TableBox.js'
import IconFont from '../../../../utils/iconfont/iconfont'
import QuoteTr from '../QuoteTr/QuoteTr.js'
import { toDecimal } from '../../../../utils/utilFunc'

import { useEffect, useState } from 'react'
import { connect } from 'react-redux'

const QuoteSPane = (props) => {
  const { list, types, socket } = props
  console.log("QSP render!",list)
  const initTrData = () => {
    // console.log("======initTrData")
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
    // console.log("======sendMessage")
    const args = types.join(".")
    socket.send({
      "cmd": "quote",
      "args": [`${args}`]
    })
  }
  const onMessage = (data) => {
    // console.log("======onMessage")
    if(data.type !== "quote") {
      return
    }
    data = data.data
    for(var item of trData) {
      if(item.symbol === data.symbol) {
        console.log("=====update quote!,symbol: ",item.symbol)
        item.buy = toDecimal(data.ask, data.digits)
        item.sell = toDecimal(data.bid, data.digits)
        item.spread = toDecimal(data.ask - data.bid, data.digits)
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
        expandedRowRender={<QuoteTr />}
      ></TableBox>
    </div>
  )
}

// const getQuoteByType = (list,qType) => {
//   return list[qType]
// }

// const mapStateToProps = (state) => {
//   const { 
//     filterType = '',
//     list = {}
//   } = state.QuoteReducer
//   return {
//     list: list[filterType]
//   }
// }

export default connect(
  state => ({
    socket: state.MainReducer.initSocket
  })
)(QuoteSPane)