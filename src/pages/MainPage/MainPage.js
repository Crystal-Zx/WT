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
import { setTheme } from './MainAction'
import user from '../../services/user'

const { Option } = Select

function MainPage ({ theme, dispatch }) {
  // const userInfo = JSON.parse(sessionStorage.getItem("wt_userInfo"))
  // const currAcc = (userInfo && userInfo.account) || ''
  const [currDate, setCurrDate] = useState(getCurrDate())
  const [isLoading, setIsLoading] = useState(false)

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
  const onChangeAcc = (account) => {
    // setIsLoading(true)
    user.setCurrAcc(account)
  }
  
  useEffect(() => {
    init()
  },[])

  useEffect(() => {
    console.log(document.readyState)
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
          <IconFont type="iconWifi" className="main-icon-wifi" />
          <Select 
            className="tr-select-changeAcc"
            defaultValue={user.getCurrAcc() && user.getCurrAcc().account}
            suffixIcon={<IconFont type="iconDD" className="main-icon-dd" />}
            onChange={onChangeAcc}
          >
            {
              Array.isArray(user.getAccInfo()) && user.getAccInfo().map(item => {
                return (
                  <Option value={item.account}>
                    {Number(item.type) === 1 ? 'DEMO' : 'LIVE'}&nbsp;
                    {item.account}
                  </Option>
                )
              })
            }
          </Select>
          {/* <Dropdown 
            overlay={
              <Menu>
                {
                  Array.isArray(user.getAccInfo()) && user.getAccInfo().map(item => {
                    return (
                      <Menu.Item data-account={item.account}>{item.account}</Menu.Item>
                    )
                  })
                }
                <Menu.Item>
                  <a href="javascrip:;" onClick={onLogout}>退出登录</a>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Button className="tr-btn-changeAcc">
              {user.getType() === 1 ? 'DEMO' : ''}&nbsp;
              {user.getCurrAcc() && user.getCurrAcc().account}
              <IconFont type="iconDD" className="main-icon-dd" />
            </Button>
          </Dropdown> */}
          {/* <IconFont type="iconMenu" className="main-icon-menu" /> */}
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