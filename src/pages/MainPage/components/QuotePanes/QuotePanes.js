import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'

import { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { initSocket } from '../../MainAction'
import { getSymbols, setSymbols } from './QuoteAction'

import { _login } from '../../../../services/index.js';
import QuoteSPane from './QuoteSPanes.js';
import styles from './QuotePanes.module.scss';

import { slist } from '../../../../services/mock'
import { toDecimal } from '../../../../utils/utilFunc'

const QuotePanes = (props) => {
  // console.log("====QuotePanes render", props.symbolList) 
  const { 
    dispatch, symbolList, socket
  } = props
  const { list, isFetching } = symbolList
  let cacheList = list
  const [qspTemp, setQspTemp] = useState([])
  const [activeKey, setActiveKey] = useState()
  const cacheRef = useRef(cacheList)  // 在组件整个生命周期内保存该变量的值，以便useEffect中的interval定时器能拿到值，定时存一次store
  
  // 获取报价QSP页面
  const getQuoteSPanes = (types) => {
    return types.map((sType) => {
      return {
        title: sType,
        content: <QuoteSPane
          group={sType}
        />,
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
        key: item.name,
        isShow: 1
      }))
      const groups = cacheList.map(item => item.group)
      const types = [...new Set(groups)]  // set去重
      dispatch(getSymbols({ isFetching: false, list: cacheList }))
      // init qsp
      setQspTemp(getQuoteSPanes(types))
      onChangeType(cacheList[0].group)
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
    cacheRef.current = cacheList.concat([])
  }
  // 切换QSP页面
  const onChangeType = (sType) => {
    setActiveKey(sType)
    const qspList = cacheList.filter(item => item.group === sType)
    const symbols = qspList.map(item => item.name)
    const currType = [...new Set(symbols)]
    const args = currType.join(".")
    // 获取报价信息
    socket.send({
      "cmd": "quote",
      "args": [`${args}`]
    })
    socket.send({
      "cmd": "mini",
      "args": [`${args}`]
    })
  }
  
  useEffect(() => { // 仅didmounted时执行一次
    dispatch(initSocket())
    const t = setInterval(() => {
      dispatch(setSymbols(cacheRef.current))
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
  }, [JSON.stringify(socket)])// ,types.length])
  
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
                onChange={sType => onChangeType(sType)}
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

export default connect(
  state => {
    const {
      symbolList = {}
    } = state.QuoteReducer
    const socket = state.MainReducer.initSocket
    return {
      symbolList,
      socket
    }
  }
)(QuotePanes)