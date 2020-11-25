import CardTabs from '../../comm/CardTabs/CardTabs.js'
import ChartPanes from '../ChartPanes/ChartPanes.js'


const topRPanes = [
  { title: '图表', content: <ChartPanes />, key: '1' },
  { title: '新闻信息', content: '新闻信息', key: '2' },
  { title: '财经日历', content: '财经日历', key: '3' },
  { title: '市场分析', content: '市场分析', key: '4' }
]

export default function TopRPanes () {

  return (
    <div className="right-x card-container">
      <CardTabs initialPanes={topRPanes}></CardTabs>
    </div>
  )
}