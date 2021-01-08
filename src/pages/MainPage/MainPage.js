import { Menu, Dropdown, Button } from 'antd';

// import CardTabs from '../../components/CardTabs/CardTabs.js';
import QuotePanes from './components/QuotePanes/QuotePanes.js'
import TopRPanes from './components/TopRPanes/TopRPanes.js';
import OrderPanes from './components/OrderPanes/OrderPanes.js'
import AccountInfo from './components/AccountInfo/AccountInfo.js'
import IconFont from '../../utils/iconfont/iconfont';
import styles from './MainPage.module.scss';

import { useEffect, useState } from 'react';
// import { connect } from 'react-redux'
import { getCurrDate } from '../../utils/utilFunc'

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


function MainPage () {
  console.log("====MainPage render")
  const [currDate, setCurrDate] = useState(getCurrDate())

  const init = () => {
    // 开启右上角时钟计时
    // const t = setInterval(() => {
    //   setCurrDate(getCurrDate())
    // }, 1000);
    // return () => {
    //   clearInterval(t)
    // }
  }
  
  useEffect(() => {
    init()
  },[])

  return (
    <div className={styles['main-x']}>
      <div className="main-top-x">
        {/* <QuotePanes /> */}
        {/* <TopRPanes /> */}
      </div>
      <div className="main-middle-x card-container">
        <OrderPanes />
      </div>
      <div className="main-bottom-x">
        <AccountInfo />
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


export default MainPage