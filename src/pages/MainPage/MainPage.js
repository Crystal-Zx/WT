import { Avatar, Image, Menu, Dropdown, Button } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
// import CardTabs from '../../components/CardTabs/CardTabs.js';
import QuotePanes from './components/QuotePanes/QuotePanes.js'
import TopRPanes from './components/TopRPanes/TopRPanes.js';
import OrderPanes from './components/OrderPanes/OrderPanes.js'
import IconFont from '../../utils/iconfont/iconfont';
import styles from './MainPage.module.scss';

import { connect } from 'react-redux';
import { initSocket } from './MainAction'
import { useEffect, useState } from 'react';
import { getCurrDate } from '../../utils/utilFunc'

// const middlePanes = [
//   { title: '持仓单', content: <OrderPanes type="1" />, key: '1' },
//   { title: '挂单交易', content: <OrderPanes type="2" />, key: '2' },
//   {
//     title: '历史订单', content: <OrderPanes type="3" />, key: '3',
//   },
// ];

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
  // console.log("=====MainPage props:", props)

  const { initSocket } = props
  const [currDate, setCurrDate] = useState(getCurrDate())
  
  useEffect(() => {
    initSocket()
    const t = setInterval(() => {
      setCurrDate(getCurrDate())
    }, 1000);
    return () => {
      clearInterval(t)
    }
  },[])

  return (
    <div className={styles['main-x']}>
      <div className="main-top-x">
        <QuotePanes />
        <TopRPanes />
      </div>
      <div className="main-middle-x card-container">
        {/* <CardTabs initialPanes={middlePanes}></CardTabs> */}
        <OrderPanes />
      </div>
      <div className="main-bottom-x">
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
        <Button type="primary" className="btn-more">
          <IconFont type="iconQues" className="main-icon-ques" />
        </Button>
      </div>
      <div className="main-topright-x">
        <span className="tr-currtime-x">{currDate}</span>
        <IconFont type="iconLayout" className="main-icon-layout" />
        <IconFont type="iconDark" className="main-icon-dark" />
        <IconFont type="iconWifi" className="main-icon-wifi" />
        <Dropdown overlay={menu} placement="bottomRight">
          <Button className="tr-btn-changeAcc">DEMO 11593
            <IconFont type="iconDD" className="main-icon-dd" />
          </Button>
        </Dropdown>
        <IconFont type="iconMenu" className="main-icon-menu" />
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    initSocket: () => {
      dispatch(initSocket())
    }
  }
}

export default connect(null, mapDispatchToProps)(MainPage)