import { Menu, Dropdown, Button } from 'antd';

import QuotePanes from './components/QuotePanes/QuotePanes.js'
import TopRPanes from './components/TopRPanes/TopRPanes.js';
import OrderPanes from './components/OrderPanes/OrderPanes.js'
import AccountInfo from './components/AccountInfo/AccountInfo.js'
import Login from '../../components/Login/Login'
import IconFont from '../../utils/iconfont/iconfont';
import styles from './MainPage.module.scss';

import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { getCurrDate } from '../../utils/utilFunc'
import { setTheme } from './MainAction'

function MainPage ({ theme, dispatch }) {
  const userInfo = JSON.parse(sessionStorage.getItem("wt_userInfo"))
  const currAcc = (userInfo && userInfo.account) || ''
  const [currDate, setCurrDate] = useState(getCurrDate())

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
  const onLogout = () => {
    sessionStorage.clear()
    setInterval(() => {
      window.location.reload()
    }, 0);
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
            <IconFont type="iconDark" className="wt-icon main-icon-dark" />
          }
          {
            theme === 'dark' &&
            <IconFont type="iconLight" className="wt-icon main-icon-light" />
          }
        </Button>
        <IconFont type="iconWifi" className="main-icon-wifi" />
        <Dropdown 
          overlay={
            <Menu>
              <Menu.Item>
                <a href="javascrip:;" onClick={onLogout}>退出登录</a>
              </Menu.Item>
            </Menu>
          } 
        placement="bottomRight">
          <Button className="tr-btn-changeAcc">DEMO {currAcc}
            <IconFont type="iconDD" className="main-icon-dd" />
          </Button>
        </Dropdown>
        {/* <IconFont type="iconMenu" className="main-icon-menu" /> */}
      </div>
      <Login />
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