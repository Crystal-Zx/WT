import { useState } from 'react'
import IconFont from '../../../utils/iconfont/iconfont.js'
import CardTabs from '../../comm/CardTabs/CardTabs.js'
import { Button } from 'antd'
import TVChartContainer from '../TVChartContainer/TVChartContainer.js'

import './ChartPanes.scss'

const chartSPanes = [
  { 
    title: 'EURUSD（D1）', 
    content: <TVChartContainer symbol='EURUSD' />,
    key: '1' ,
    closable: true
  },
  { title: 'GBPAUD（1h）', content: "<TVChartContainer symbol='GBPAUD' />", key: '2',
  closable: true },
  { title: 'XAUUSD（30m）', content: "<TVChartContainer symbol='XAUUSD' />", key: '3',
  closable: true },
  { title: 'CADUSD（15m）', content: "<TVChartContainer symbol='CADUSD' />", key: '4',
  closable: true }
]


export default function ChartPanes () {
  const _symbolList = [
    {
      symbol: 'EURUSD',
      resolution: '1',
      closable: true,
      key: '1',
      pricePrecision: 5
    },
    {
      symbol: 'GBPUSD',
      resolution: '15',
      closable: true,
      key: '2',
      pricePrecision: 5
    }
    // {
    //   symbol: 'XAUUSD',
    //   resolution: '30',
    //   closable: true,
    //   key: '3',
    //   pricePrecision: 5
    // },
    // {
    //   symbol: 'USDJPY',
    //   resolution: '5',
    //   closable: true,
    //   key: '4',
    //   pricePrecision: 5
    // },
    // {
    //   symbol: 'JPYGBP',
    //   resolution: '45',
    //   closable: true,
    //   key: '5',
    //   pricePrecision: 5
    // }
  ]

  const [symbolList, setSymbolList] = useState(_symbolList)
  const [activeKey, setActiveKey] = useState(symbolList[0].key)
  const [symbol, setSymbol] = useState(symbolList[0].symbol)
   
  const sbStyle = ((sbl) => {
    const len = sbl.length
    let style = null
    if(len <= 4) {
      style = {
        width: '25%'
      }
    } else if(len > 4 && len < 6) {
      style = {
        width: 'unset',
        flex: 1
      }
    } else {
      style = {
        width: '180px',
        flexShrink: '0'
      }
    }
    return style
  })(symbolList)

  const changeSymbol = (sb) => {
    const { key,symbol } = sb
    setActiveKey(key)
    setSymbol(symbol)
  }
  // 删除当前选中项，则删除后默认选中前一项。当仅剩一项，则不能再次进行删除
  const deleteSymbol = (e,targetKey) => {
    e.stopPropagation()
    let lastIndex
    symbolList.forEach((sb,i) => {
      if(sb.key == targetKey) {
        lastIndex = i > 1 ? i - 1 : 0
      }
    })
    const newSbl = symbolList.filter(sb => sb.key != targetKey)
    if(newSbl.length && targetKey == activeKey) {
      setActiveKey(newSbl[lastIndex].key)
      setSymbol(newSbl[lastIndex].symbol)
    }
    if(newSbl.length === 1) newSbl[0].closable = false
    setSymbolList(newSbl)
  }

  /**
   * 更改当前货币的时间周期 --- 传递给子组件，在子组件调用
   * @param {string} resolution 子组件传递过来的值：当前货币的时间周期resolution
   */
  const onChangeResolution = (resolution) => {
    try {
      symbolList.forEach((sb) => {
        console.log(sb.symbol,symbol)
        if(sb.symbol === symbol) {
          sb.resolution = resolution
          throw new Error("break")
        }
      })
    } catch(e) {
      if(e.message === "break") {
        setSymbolList(symbolList.concat([]))
        console.log("symbolList",symbolList)
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

  return (
    <>
      {/* <CardTabs 
        className="chartpanes-x"
        initialPanes={chartSPanes}
        type="editable-card"
        tabPosition="bottom"
        tabBarGutter={2}
      /> */}
      <TVChartContainer 
        symbol={symbol} 
        resolution={getResolutionBySymbol(symbol)}
        symbolList={symbolList} 
        onChangeResolution={onChangeResolution}
      />
      <div className="symbol-x">
        <div className="symbol-ul">
          {
            symbolList.map(sb => (
              <div
                className={'symbol-li' + (activeKey == sb.key ? ' active' : '')}
                style={sbStyle}
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