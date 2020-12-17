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
        isShow: 1
      }
    })
  }
  
  const [trData, setTrData] = useState(initTrData())
  const [isExpandAll, setIsExpandAll] = useState(false)  
  
  useEffect(() => {
    socket.on("quote", onMessage)
  },[])
  
  useEffect(() => {
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
  const onSearch = (value) => {
    const _trData = trData.map(
      item => item.isShow = item.key.toUpperCase().indexOf(value.toUpperCase()) === -1 ? 0 : 1
      // item => item.key.toUpperCase().indexOf(value.toUpperCase()) !== -1
    )
    setTrData(_trData)
  }
  const onChangeExpand = () => {
    setIsExpandAll(!isExpandAll)
  }

  return (
    <div className="quote-x">
      <div className="search-container">
        <SearchBox 
          onSearch={onSearch}
        />
        <Button 
          type="primary" 
          className="btn-more"
          onClick={onChangeExpand}
        >
          <IconFont type="iconSquare" className="iconSquare" />
        </Button>
      </div>
      <TableBox
        data={trData.filter(item => item.isShow)}
        addToFavorite={addToFavorite}
        addToKLine={addToKLine}
        isExpandAll={isExpandAll}
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