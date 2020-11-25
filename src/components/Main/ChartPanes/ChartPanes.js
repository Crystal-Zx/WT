import CardTabs from '../../comm/CardTabs/CardTabs.js'
import ChartSPanes from '../ChartSPanes/ChartSPanes.js'

import './ChartPanes.scss'

const chartSPanes = [
  { 
    title: 'AUDUSD（D1）', 
    content: <ChartSPanes />,
    key: '1' ,
    closable: true
  },
  { title: 'GBPAUD（1h）', content: <ChartSPanes />, key: '2',
  closable: true },
  { title: 'XAUUSD（30m）', content: <ChartSPanes />, key: '3',
  closable: true },
  { title: 'CADUSD（15m）', content: <ChartSPanes />, key: '4',
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