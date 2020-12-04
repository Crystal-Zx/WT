import { StarFilled } from '@ant-design/icons';

import CardTabs from '../../comm/CardTabs/CardTabs.js'
import LineTabs from '../../comm/LineTabs/LineTabs.js'
import QuoteSPanes from '../QuoteSPanes/QuoteSPanes.js'

const quoteSPanes = [
  { 
    title: <StarFilled />, 
    content: <QuoteSPanes />,
    key: '1' 
  },
  { title: 'FX', content: <QuoteSPanes />, key: '2' },
  { title: 'IND', content: <QuoteSPanes />, key: '3' },
  { title: 'STO', content: <QuoteSPanes />, key: '4' },
  { title: '全部', content: <QuoteSPanes />, key: '5' }
]
const quotePanes = [
  { title: '品种报价', 
    content: (
      <div className="line-container">
        <LineTabs initialPanes={quoteSPanes} defaultActiveKey="2"></LineTabs>
      </div>
    ), 
    key: '1'
  }
]

export default function QuotePanes (props) {
  const { socket } = props
  return (
    <div className="left-x card-container">
      <CardTabs initialPanes={quotePanes}></CardTabs>
    </div>
  )
}