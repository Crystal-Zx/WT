import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import ChartPanes from '../ChartPanes/ChartPanes.js'
import NewsPanes from './NewsPanes.js'
import CalendarPanes from './CalendarPanes'

import { useState } from 'react'

const topRPanes = [
  { title: '图表', content: <ChartPanes />, key: '1' },
  // { title: '新闻信息', content: <NewsPanes />, key: '2' },
  { title: '财经日历', content: <CalendarPanes />, key: '3' },
  // { title: '市场分析', content: '市场分析', key: '4' }
]

export default function TopRPanes () {
  console.log("====TopRPanes render")

  const [activeKey, setActiveKey] = useState(topRPanes[0].key)

  const onChange = activeKey => {
    setActiveKey(activeKey)
  }
  return (
    <div className="right-x card-container">
      <CardTabs 
        activeKey={activeKey}
        initialPanes={topRPanes}
        onChange={onChange}
      ></CardTabs>
    </div>
  )
}