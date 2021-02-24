import { useState, useEffect } from 'react'
import IconFont from '../../../../utils/iconfont/iconfont'
import { Button, Modal } from 'antd'
import TVChartContainer from '../TVChartContainer/TVChartContainer.js'

import styles from './ChartPanes.module.scss'

import { connect } from 'react-redux'
import { deleteFromKLine } from '../../MainAction'
import TradeModal from '../../../../components/TradeModal/TradeModal'

const ChartPanes = ({ kLineList, initSocket, deleteFromKLine, _symbolList }) => {
  
  console.log("====ChartPanes render")
  
  const initKLineList = (kLineList) => {
    return kLineList.map((item, index) => {
      return {
        key: item.symbol,
        symbol: item.symbol,
        resolution: '1',
        closable: kLineList.length !== 1 ? true : false,
        pricePrecision: item.digits
      }
    })
  }

  const [symbolList, setSymbolList] = useState([])  // K线部分货币对列表
  const [activeKey, setActiveKey] = useState('')
  // const [symbol, setSymbol] = useState('')
  const [socket, setSocket] = useState({})
  const [isShowModal, setIsShowModal] = useState(false)
   
  const sbStyle = (sbl) => {
    const len = sbl.length
    let style = null
    if(len <= 4) {
      style = {
        width: '25%'
      }
    } else if(len > 4) {  // && len <= 7
      style = {
        width: 'unset',
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden'
        // textOverflow: 'ellipse'
      }
    } 
    // else {
    //   style = {
    //     width: '180px',
    //     flexShrink: '0'
    //   }
    // }
    return style
  }

  const changeSymbol = (sb) => {
    const { key,symbol } = sb
    setActiveKey(key)
    // setSymbol(symbol)
  }
  // 删除当前选中项，则删除后默认选中前一项。当仅剩一项，则不能再次进行删除
  const deleteSymbol = (e,targetKey) => {
    e.stopPropagation()
    let lastIndex
    symbolList.forEach((sb,i) => {
      if(sb.key === targetKey) {
        lastIndex = i > 1 ? i - 1 : 0
      }
    })
    const newSbl = symbolList.filter(sb => sb.key !== targetKey)
    if(newSbl.length && targetKey === activeKey) {
      setActiveKey(newSbl[lastIndex].key)
    }
    if(newSbl.length === 1) newSbl[0].closable = false
    setSymbolList(newSbl)
    deleteFromKLine(targetKey)
  }

  /**
   * 更改当前货币的时间周期 --- 传递给子组件，在子组件调用
   * @param {string} resolution 子组件传递过来的值：当前货币的时间周期resolution
   */
  const onChangeResolution = (resolution) => {
    try {
      symbolList.forEach((sb) => {
        if(sb.symbol === activeKey) {
          sb.resolution = resolution
          throw new Error("break")
        }
      })
    } catch(e) {
      if(e.message === "break") {
        setSymbolList(symbolList.concat([]))
      } else {
        throw e
      }
    }
  }

  /**
   * 根据货币名称返回其 当前/上一次 选中的时间周期
   * @param {string} symbol 当前货币名称
   * @returns resolution 值为tradingview所需格式
   */
  const getResolutionBySymbol = (symbol) => {
    for(var sb of symbolList) {
      if(sb.symbol === symbol) {
        return sb.resolution
      }
    }
  }

  /**
   * 
   * @param {string} resolution 
   */
  const getResolutionForCh = (resolution) => {
    let resolutionCh
    if(!isNaN(Number(resolution))) {  // 纯数字 || 小时 ==> 分钟
      resolutionCh = resolution < 60 ? `${resolution}m` : `${resolution / 60}h`
    } else { // 其余时间周期
      // 除 年 以外均直接显示参数值
      if(resolution.toLowerCase().indexOf("m") !== -1 && parseInt(resolution) >= 12) {
        resolutionCh = Math.floor(parseInt(resolution) / 12) + "年"
      }
    }
    return resolutionCh || resolution.toLowerCase()
  }

  useEffect(() => {
    if(kLineList.length) {
      const symbolList = initKLineList(kLineList),
            activeSymbol = kLineList.filter(item => item.isActive),
            activeKey = activeSymbol[0] && activeSymbol[0].symbol
            
      setSymbolList(symbolList)
      setActiveKey(activeKey || symbolList[kLineList.length - 1].key)
      // setSymbol(symbolList[kLineList.length - 1].symbol)
    }
  }, [JSON.stringify(kLineList)])

  useEffect(() => {
    setSocket(initSocket)
  }, [Object.keys(initSocket).length])

  return (
    <>
      {/* <CardTabs 
        className="chartpanes-x"
        initialPanes={chartSPanes}
        type="editable-card"
        tabPosition="bottom"
        tabBarGutter={2}
      /> */}
      <div className={styles["tvc-x"]}>
        {
          Object.keys(socket).length > 0 && 
          <TVChartContainer
            socket={socket}
            symbol={activeKey}
            resolution={getResolutionBySymbol(activeKey)}
            symbolList={symbolList}  //.filter(item => item.symbol === symbol)
            onChangeResolution={onChangeResolution}
            onShowTradeModal={() => setIsShowModal(true)}
          />
        }
        {
          _symbolList && _symbolList.length &&
          <TradeModal 
            visible={isShowModal}
            symbol={activeKey}
            onHideTradeModal={() => setIsShowModal(false)}
            symbolInfo={_symbolList.filter(item => item.symbol === activeKey)[0]}
          />
        }
      </div>
      <div className={styles["symbol-x"]}>
        <div className="symbol-ul">
          {
            symbolList.map(sb => (
              <div
                key={sb.key}
                className={'symbol-li' + (activeKey === sb.key ? ' active' : '')}
                style={sbStyle(symbolList)}
                onClick={() => changeSymbol(sb)}
              >
                <span>{sb.symbol}（{getResolutionForCh(sb.resolution)}）</span>
                {
                  sb.closable
                  && 
                  <Button 
                    className="btn-reset btn-symbol-delete"
                    onClick={(e) => deleteSymbol(e,sb.key)}
                  >
                    <IconFont type="iconDelete" className="iconDelete" />
                  </Button>
                }
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default connect(
  state => {
    const {
      kLineList,
      initSocket,
      symbolList
    } = state.MainReducer
    
    return {
      kLineList,
      initSocket,
      _symbolList: symbolList.list
    }
  },
  dispatch => {
    return {
      deleteFromKLine: (symbol) => {
        dispatch(deleteFromKLine(symbol))
      }
    }
  }
)(ChartPanes)