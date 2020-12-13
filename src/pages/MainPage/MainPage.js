import './MainPage.scss';
import { Avatar, Image, Menu, Dropdown, Button } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import CardTabs from '../../components/CardTabs/CardTabs.js';
import QuotePanes from './components/QuotePanes/QuotePanes.js'
import TopRPanes from './components/TopRPanes/TopRPanes.js';
import IconFont from '../../utils/iconfont/iconfont';

// import { useEffect } from 'react'
// import { connect } from 'react-redux';

const middlePanes = [
  { title: '持仓单', content: '持仓单', key: '1' },
  { title: '挂单交易', content: '挂单交易', key: '2' },
  {
    title: '历史订单', content: '历史订单', key: '3',
  },
];

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

function MainPage (props) {


  let quote = [{
    "symbol": "EURUSD",
    "ask": 1.18221,
    "bid":1.182,
    "digits":5,
    "point": 1e-05,
    "trans_price":5
  }]

  return (
    <div className="main-x">
      <div className="top-x">
        <QuotePanes />
        <TopRPanes />
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
        <div className="account-info-x">
          <div className="ai-li">
            <span>余额</span>
            <span>$ 5000.00</span>
          </div>
          <div className="ai-li">
            <span>净值</span>
            <span>$ 4910.66</span>
          </div>
          <div className="ai-li">
            <span>可用保证金</span>
            <span>$ 1157602.00</span>
          </div>
          <div className="ai-li">
            <span>保证金比例</span>
            <span>0.23%</span>
          </div>
          <div className="ai-li">
            <span>浮动盈亏</span>
            <span>-$ 89.34</span>
          </div>
          <div className="ai-li profit">
            <span>盈利：&nbsp;</span>
            <span>- 69.58</span>
            <span>&nbsp;USD</span>
          </div>
        </div>
        <Button type="primary" className="btn-more"><IconFont type="iconQues" className="iconQues" /></Button>
      </div>
      <div className="top-right-x">
        <span className="tr-currtime-x">2020年09月04日 10:45:56</span>
        <IconFont type="iconLayout" className="iconLayout" />
        <IconFont type="iconDark" className="iconDark" />
        <IconFont type="iconWifi" className="iconWifi" />
        <Dropdown overlay={menu} placement="bottomRight">
          <Button className="tr-btn-changeAcc">DEMO 11593
            <IconFont type="iconDD" className="iconDD" />
          </Button>
        </Dropdown>
        <IconFont type="iconMenu" className="iconMenu" />
      </div>
    </div>
  )
}

// const mapStateToProps = state => state
// const mapDispatchToProps = (dispatch,ownProps) => {
//   return {
//     getList: () => {
//       dispatch(setFilterType())
//       dispatch(axiosPosts()).then(() => {
//         console.log("ownProps",ownProps)
//       })
//     }
//   }
// }

export default MainPage