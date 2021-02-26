import { Menu, Dropdown, Button, Select, Spin } from 'antd';

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
import { setTheme, isSuspension } from './MainAction'
import user from '../../services/user'

const { Option } = Select

function MainPage ({ theme, dispatch }) {
  
  const [currDate, setCurrDate] = useState(getCurrDate())
  const [isLoading, setIsLoading] = useState(false)

  const changeTheme = () => {
    if(theme === 'light') {
      // setTheme('dark')
      window.document.documentElement.setAttribute("data-theme", 'dark')
      localStorage.setItem("wt_theme", 'dark')
      dispatch(setTheme('dark'))  // 保持tradingview图表的主题与之一致
    } else {
      // setTheme('light')
      window.document.documentElement.setAttribute("data-theme", 'light')
      localStorage.setItem("wt_theme", 'light')
      dispatch(setTheme('light'))
    }
  }
  const onLogout = () => {
    sessionStorage.clear()
    setInterval(() => {
      window.location.reload()
    }, 0);
  }
  const onChangeAcc = (account) => {
    user.setCurrAcc(account)
    setInterval(() => {
      window.location.reload()
    }, 0);
  }
  
  useEffect(() => {
    // 设置当前是否停盘
    dispatch(isSuspension())
    // 设置主题
    window.document.documentElement.setAttribute("data-theme", theme)
    // 开启右上角时钟计时
    const t = setInterval(() => {
      setCurrDate(getCurrDate())
    }, 1000);
    return () => {
      clearInterval(t)
    }
  },[])

  useEffect(() => {
    const readyState = document.readyState
    if(readyState === "complete") {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  },[document.readyState])

  return (
    <Spin
      className={styles['main-spin-x']}
      wrapperClassName={styles['main-spin-x']}
      spinning={isLoading}
      size="large"
    >
      <div className='main-x'>
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
          {/* <IconFont type="iconWifi" className="main-icon-wifi" /> */}
          <Select 
            className="tr-select-changeAcc"
            defaultValue={user.getCurrAcc() && user.getCurrAcc().account}
            suffixIcon={<IconFont type="iconDD" className="main-icon-dd" />}
            onChange={onChangeAcc}
          >
            {
              Array.isArray(user.getAccInfo()) && user.getAccInfo().map(item => {
                return (
                  <Option key={item.account} value={item.account}>
                    {Number(item.type) === 1 ? 'DEMO' : 'REAL'}&nbsp;
                    {item.account}
                  </Option>
                )
              })
            }
          </Select>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <IconFont type="iconLogout" />&nbsp;
                  <a href="javascrip:;" onClick={onLogout}>退出登录</a>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Button type="default" className="tr-btn-menu">
              <IconFont type="iconMenu" className="main-icon-menu" />
            </Button>
          </Dropdown>
        </div>
        <Login />
      </div>
    </Spin>
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