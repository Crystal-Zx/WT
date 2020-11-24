import './MainPage.scss';
import { Avatar, Image } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import CardTabs from '../../components/comm/CardTabs/CardTabs';
import LineTabs from '../../components/comm/LineTabs/LineTabs';
import QuotePanes from '../../components/Main/QuotePanes/QuotePanes.js'



const topRPanes = [
  { title: '图表', content: '图表', key: '1' },
  { title: '新闻信息', content: '新闻信息', key: '2' },
  { title: '财经日历', content: '财经日历', key: '3' },
  { title: '市场分析', content: '市场分析', key: '4' }
]
const middlePanes = [
  { title: '持仓单', content: '持仓单', key: '1' },
  { title: '挂单交易', content: '挂单交易', key: '2' },
  {
    title: '历史订单', content: '历史订单', key: '3',
  },
];

function MainPage () {

  return (
    <div className="main-x">
      <div className="top-x">
        <QuotePanes />
        <div className="right-x card-container">
          <CardTabs initialPanes={topRPanes}></CardTabs>
        </div>
      </div>
      <div className="middle-x card-container">
        <CardTabs initialPanes={middlePanes}></CardTabs>
      </div>
      <div className="bottom-x">
        <div className="user-x">
          <span className="account-type">DEMO</span>
          <Avatar icon={<UserOutlined />} size={24} />
          <span className="account">11593</span>
        </div>
      </div>
    </div>
  )
}

export default MainPage