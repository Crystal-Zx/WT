import { Menu, Dropdown, Button } from 'antd';

import QuotePanes from './components/QuotePanes/QuotePanes.js'
import TopRPanes from './components/TopRPanes/TopRPanes.js';
import OrderPanes from './components/OrderPanes/OrderPanes.js'
import AccountInfo from './components/AccountInfo/AccountInfo.js'
import IconFont from '../../utils/iconfont/iconfont';
import styles from './MainPage.module.scss';

import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { getCurrDate } from '../../utils/utilFunc'
import { setTheme } from './MainAction'

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


function MainPage ({ theme, dispatch }) {
  const [currDate, setCurrDate] = useState(getCurrDate())
  // const [theme, setTheme] = useState(defaultTheme)

  const init = () => {
    window.document.documentElement.setAttribute("data-theme", theme)
    // 开启右上角时钟计时
    const t = setInterval(() => {
      setCurrDate(getCurrDate())
    }, 1000);
    return () => {
      clearInterval(t)
    }
  }
  const changeTheme = () => {
    if(theme === 'light') {
      // setTheme('dark')
      window.document.documentElement.setAttribute("data-theme", 'dark')
      dispatch(setTheme('dark'))  // 保持tradingview图表的主题与之一致
    } else {
      // setTheme('light')
      window.document.documentElement.setAttribute("data-theme", 'light')
      dispatch(setTheme('light'))
    }
  }
  
  useEffect(() => {
    init()
  },[])

  return (
    <div className={styles['main-x']}>
      <div className="main-top-x">
        <QuotePanes />
        <TopRPanes />
      </div>
      <div className="main-middle-x card-container">
        <OrderPanes />
      </div>
      <div className="main-bottom-x">
        <AccountInfo />
      </div>
      <div className="main-topright-x">
        <span className="tr-currtime-x">{currDate}</span>
        {/* <IconFont type="iconLayout" className="main-icon-layout" /> */}
        {/* <Switch className="tr-switch-theme" /> */}
        <Button 
          type="default" 
          className="tr-btn-changetheme"
          onClick={changeTheme}
        >
          {
            theme === 'light' &&
            <IconFont type="iconDark" className="main-icon-dark" />
          }
          {
            theme === 'dark' &&
            <IconFont type="iconLight" className="main-icon-dark" />
          }
        </Button>
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


export default connect(
  state => {
    const { theme } = state.MainReducer
    return {
      theme
    }
  }
)(MainPage)