import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'

import React,{ useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { 
  initSocket, 
  getSymbols, 
  setSymbols, 
  setSymbolGroup
} from '../../MainAction'

import QuoteSPane from './QuoteSPanes.js';
import styles from './QuotePanes.module.scss';

import { slist } from '../../../../services/mock'
import { toDecimal } from '../../../../utils/utilFunc'

const QuotePanes = (props) => {
  console.log("====QuotePanes render", props) 
  const { 
    dispatch, symbolList, filterGroup, socket, orderSymbols
  } = props
  const { list, isFetching } = symbolList
  let cacheList = list
  const [qspTemp, setQspTemp] = useState([])
  const [activeKey, setActiveKey] = useState()
  const prevListRef = useRef(null)
  const cacheListRef = useRef(null)  // 在组件整个生命周期内保存该变量的值，以便useEffect中的interval定时器能拿到值，定时存一次store
  
  // 获取报价QSP页面
  const getQuoteSPanes = (types) => {
    return types.map((sType) => {
      return {
        title: sType,
        content: <QuoteSPane />,
        key: sType
      }
    })
  }
  // 获取报价列表数据
  const onMessage = (data) => { // slist 为 mock 数据
    if(data.type === "symbol") {
      data = data.data
      cacheList = slist.map(item => ({
        ...item,
        key: item.name
      }))
      dispatch(getSymbols({ isFetching: false, list: cacheList }))
      dispatch(setSymbolGroup(cacheList[0].group))
      // init qsp
      const groups = [...new Set(cacheList.map(item => item.group))]  // set去重
      setQspTemp(getQuoteSPanes(groups))
      // onChangeType(cacheList[0].group)
    } else if(data.type === "quote") {
      data = data.data
      
      for(let item of cacheList) {
        if(item.name === data.symbol) {
          data.isUp = item.bid ? data.bid >= item.bid : 1
          data.size = data.contract_size
          data.spread = toDecimal((data.ask - data.bid) * 100, data.digits < 2 ? data.digits : 2) + "%"
          delete data.contract_size
          Object.assign(item, data)
          break
        }
      }
    } else if(data.type === "mini") {
      data = data.data
      const symbols = data.map(item => item.symbol)
      cacheList = cacheList.map(item => {
        if(symbols.includes(item.name)) {
          const _data = data.filter(_item => _item.symbol === item.name)[0]
          if(_data.ticks && _data.ticks.length) {
            const high = Math.max(..._data.ticks),
                  low = Math.min(..._data.ticks)
            return {
              ...item,
              high,
              low,
              per: Math.floor((high - low) / low * 10000) / 100 + '%',
            }
          } else {
            return item
          }
        } else {
          return item
        }
      })
    }
    cacheListRef.current = cacheList.concat([])
  }
  const sendQuoteMsg = (quoteSymbols) => {
    const currType = [...new Set(quoteSymbols.concat(orderSymbols))]
    const args = currType.join(".")
    console.log("====currType", currType)
    // 获取报价信息
    socket.send({
      "cmd": "quote",
      "args": [`${args}`]
    })
  }
  // 切换QSP页面
  const onChangeType = (sType) => {
    setActiveKey(sType)
    // 获取需监听quote信息的货币对列表
    // --- 报价板块
    const qspList = cacheList.filter(item => item.group === sType)
    const quoteSymbols = qspList.map(item => item.name)
    // setQuoteSymbols(quoteSymbols)
    sendQuoteMsg(quoteSymbols)
    // --- 订单板块 orderSymbols
    // const currType = [...new Set(quoteSymbols.concat(orderSymbols))]
    // const args = currType.join(".")
    // // 获取报价信息
    // socket.send({
    //   "cmd": "quote",
    //   "args": [`${args}`]
    // })
    const args = quoteSymbols.join(".")
    socket.send({
      "cmd": "mini",
      "args": [`${args}`]
    })
  }
  
  useEffect(() => {
    prevListRef.current = list
  })
  useEffect(() => { // 仅didmounted时执行一次
    dispatch(initSocket())
    const t = setInterval(() => {
      /**
       * 直接从ref取值会由于报价更新太快每次取到不同的值，无法用于比较
       * 每次interval取一次值先转为字符串再存为常量
       * （current的值是对象，就算赋值给常量也可以进行修改的！！！）
       */ 
      const cacheVal = JSON.stringify(cacheListRef.current),
            prevVal = JSON.stringify(prevListRef.current)
      
      if(cacheVal !== prevVal) {
        dispatch(setSymbols(JSON.parse(cacheVal)))
      }
    }, 500);
    return () => clearInterval(t)
  },[])

  useEffect(() => { // 会执行3次： socket = null, connState = 1, connState = 2
    if(Object.keys(socket).length) {
      socket.on("open", () => {
        // console.log("socket open, start to sending ms...")
        socket.send({
          "cmd": "symbols",
          "args": [""]
        })
        socket.on("quote", onMessage)
      })
    }
  }, [JSON.stringify(socket)])

  useEffect(() => {
    filterGroup && onChangeType(filterGroup)
  }, [filterGroup])
  
  return (
    <div className={styles['quote-panes-x']}> 
      <CardTabs
        initialPanes={[
          {
            title: '品种报价', 
            content: (
              <LineTabs
                initialPanes={qspTemp}
                activeKey={activeKey}
                onChange={sType => dispatch(setSymbolGroup(sType))}
              ></LineTabs>
            ),
            key: '1'
          }
        ]}
        isFetching={isFetching}
      ></CardTabs>
    </div>
  )
}

const getOrderSymbols = (data) => {
  const { position, order } = data
  const arrP = position.list.map(item => item.symbol),
        arrO = order.list.map(item => item.symbol)

  return [...new Set(arrP.concat(arrO))]
}

const areEqual = (prevProps, nextProps) => {
  const prevGroup = prevProps.filterGroup,
        nextGroup = nextProps.filterGroup,
        prevList = prevProps.symbolList.list.filter(item => item.group === prevGroup),
        nextList = nextProps.symbolList.list.filter(item => item.group === nextGroup)
  /* 不更新返回true；需更新返回false */
  console.log("====OP areEqual", prevProps.orderSymbols, nextProps.orderSymbols)
  if(!!prevList.length && !!nextList.length && JSON.stringify(prevList) === JSON.stringify(nextList) && JSON.stringify(prevProps.orderSymbols) === JSON.stringify(nextProps.orderSymbols)) {
    return true
  } else {
    return false
  }
}

export default connect(
  state => {
    const {
      initSocket,
      symbolList,
      filterGroup,
      positionOrder
    } = state.MainReducer
    const orderSymbols = getOrderSymbols(positionOrder)
    
    return {
      socket: initSocket,
      symbolList,
      filterGroup,
      orderSymbols
    }
  }
)(QuotePanes)