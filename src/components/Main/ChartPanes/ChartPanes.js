import CardTabs from '../../comm/CardTabs/CardTabs.js'
import TVChartContainer from '../TVChartContainer/TVChartContainer.js'

import './ChartPanes.scss'

const chartSPanes = [
  { 
    title: 'AUDUSD（D1）', 
    content: <TVChartContainer />,
    key: '1' ,
    closable: true
  },
  { title: 'GBPAUD（1h）', content: <TVChartContainer />, key: '2',
  closable: true },
  { title: 'XAUUSD（30m）', content: <TVChartContainer />, key: '3',
  closable: true },
  { title: 'CADUSD（15m）', content: <TVChartContainer />, key: '4',
  closable: true }
]

export default function ChartPanes () {
  
  return (
    <CardTabs 
      className="chartpanes-x"
      initialPanes={chartSPanes}
      type="editable-card"
      tabPosition="bottom"
      tabBarGutter={2}
    />
  )
}