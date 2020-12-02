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
  console.log("=========chartPanes")
  const _symbolList = [
    {
      symbol: 'EURUSD',
      resolution: '1D',
      closable: true,
      key: '1'
    },
    {
      symbol: 'GBPAUD',
      resolution: '1H',
      closable: true,
      key: '2'
    },
    {
      symbol: 'XAUUSD',
      resolution: '30m',
      closable: true,
      key: '3'
    },
    {
      symbol: 'USDJPY',
      resolution: '5m',
      closable: true,
      key: '4'
    },
    {
      symbol: 'JPYGBP',
      resolution: '45s',
      closable: true,
      key: '5'
    }
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

  const changeSymbol = (activeKey) => {
    setActiveKey(activeKey)
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

  return (
    <>
      {/* <CardTabs 
        className="chartpanes-x"
        initialPanes={chartSPanes}
        type="editable-card"
        tabPosition="bottom"
        tabBarGutter={2}
      /> */}
      <TVChartContainer symbol={symbol} />
      <div className="symbol-x">
        <div className="symbol-ul">
          {
            symbolList.map(sb => (
              <div
                className={'symbol-li' + (activeKey == sb.key ? ' active' : '')}
                style={sbStyle}
                onClick={() => changeSymbol(sb.key)}
              >
                <span>{sb.symbol}（{sb.resolution}）</span>
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