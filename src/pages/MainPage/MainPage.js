import { Menu, Dropdown, Button, Select, Spin, ConfigProvider } from 'antd';

import QuotePanes from './components/QuotePanes/QuotePanes.js'
import TopRPanes from './components/TopRPanes/TopRPanes.js';
import OrderPanes from './components/OrderPanes/OrderPanes.js'
import AccountInfo from './components/AccountInfo/AccountInfo.js'
import SettingModal from '../../components/SettingModal/SettingModal.js'
import IconFont from '../../utils/iconfont/iconfont';
import styles from './MainPage.module.scss';

import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { getCurrDate } from '../../utils/utilFunc'
import { setTheme, isSuspension } from './MainAction'
import user from '../../services/user'
// 国际化
import { FormattedDate, FormattedMessage, IntlProvider } from 'react-intl';
import zh_CN from '../../locales/zh_CN'
import zh_HK from '../../locales/zh_HK'
import en_US from '../../locales/en_US'

const { Option } = Select

function MainPage ({ history, theme, socket, dispatch }) {
  const isLogin = user.isLogin()
  const messages = {
    "zhcn": zh_CN,
    "zhhk": zh_HK,
    "enus": en_US,
  }
  
  const [currDate, setCurrDate] = useState(getCurrDate())
  const [isLoading, setIsLoading] = useState(false)
  const [locale, setLocale] = useState("zhcn")
  const [settingVisible, setSettingVisible] = useState(false)

  const langOverlay = () => {
    const overlay = [
      { key: "zhcn", abbr: "CN", name: '简体中文' },
      { key: "zhhk", abbr: "HK", name: '繁體中文' },
      { key: "enus", abbr: "US", name: 'English' },
    ]
    return (
      <Menu onClick={val => setLocale(val.key)} selectedKeys={locale}>
        {
          overlay.map(item => (
            <Menu.Item key={item.key}>
              <span className="menu-item-abbr">{item.abbr}</span>{item.name}
            </Menu.Item>
          ))
        }
      </Menu>
    )
  }

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
    socket.socket.destroy()
    setTimeout(() => {
      history.push("/login")      
      window.location.reload()
    }, 0)
  }
  const onChangeAcc = (account) => {
    user.setCurrAcc(account)
    setTimeout(() => {
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
    if(isLogin === null) return
    if(!isLogin) {
      history.push("/login")
    }
  }, [isLogin])

  useEffect(() => {
    const readyState = document.readyState
    if(readyState === "complete") {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  },[document.readyState])

  return (
    <IntlProvider locale={locale.slice(0, 2)} messages={messages[locale]}>
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
            <span className="tr-currtime-x">{
              <>
                <FormattedDate 
                  value={currDate}
                  year="numeric"
                  month="long"
                  day="2-digit"
                  hour="numeric"
                  minute="numeric"
                  second="numeric"
                />
                {/* <FormattedTime 
                  value={currDate}
                  hour="numeric"
                  minute="numeric"
                /> */}
              </>
            }</span>
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
            <Dropdown
              overlay={langOverlay}
              overlayClassName={["menu-lang-x", styles['menu-lang-x']]}
            >
              <Button type="default">
                <IconFont 
                  className="wt-icon"
                  type="iconLang"
                  style={{ marginTop: "2px", fontSize: "17px"}} 
                />
              </Button>
            </Dropdown>
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
                  <Menu.Item onClick={() => setSettingVisible(true)}>
                    <IconFont className={styles["f-16"]} type="iconSetting" />&nbsp;
                    <span>
                      <FormattedMessage 
                        id="navBar.menu.settings"
                        defaultMessage="设置"
                      />
                    </span>
                  </Menu.Item>
                  <Menu.Item>
                    <IconFont className={styles["f-14"]} type="iconLogout" />&nbsp;
                    <span onClick={onLogout}>
                      <FormattedMessage 
                        id="navBar.menu.logout"
                        defaultMessage="退出登录"
                      />
                    </span>
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
          <SettingModal 
            visible={settingVisible}
            onCancel={() => setSettingVisible(false)}
          />
        </div>
      </Spin>
    </IntlProvider>
  )
}


export default connect(
  state => {
    const { theme, initSocket } = state.MainReducer
    // console.log(state.MainReducer.positionOrder)
    return {
      theme,
      socket: initSocket
    }
  }
)(MainPage)