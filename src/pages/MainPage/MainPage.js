import './MainPage.scss';
import { Avatar, Image, Menu, Dropdown, Button } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import CardTabs from '../../components/comm/CardTabs/CardTabs';
import LineTabs from '../../components/comm/LineTabs/LineTabs';
import QuotePanes from '../../components/Main/QuotePanes/QuotePanes.js'
import TopRPanes from '../../components/Main/TopRPanes/TopRPanes.js';
import IconFont from '../../utils/iconfont/iconfont';

import socket from '../../socket.js'
import { useState, useEffect } from 'react';

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

function MainPage () {
  let ws,taskRemindInterval = null
  let quote = [{
    "symbol": "EURUSD",
    "ask": 1.18221,
    "bid":1.182,
    "digits":5,
    "point": 1e-05,
    "trans_price":5
  }]
  const [symbols, setSymbols] = useState(["EURUSD.GBPUSD"])
  const [quotes, setQuotes] = useState([])
  // useEffect(() => {
  //   console.log("开始建立ws")
  //   ws = new socket({ url: "ws://47.113.231.12:5885/" })
  //   console.log(ws)
  //   ws.doOpen()
  //   ws.on('open', () => {
  //     ws.send({ "cmd": "req", "args": ["candle.M1.XAUUSD"] })
  //     // ws.send({ "cmd": "quote", "args": ["EURUSD.GBPUSD"] })
  //   })
  //   ws.on('message', ws.onMessage)
  //   return () => {
  //     ws.onClose()
  //   }
  // },[symbols])
  
  const handleQuotes = (_quote) => {
    for(var quote of quotes) {
      if(quote.symbol === _quote.symbol) {
        
      }
    }
    // quotes.map((quote) => {
    //   if(quote.includes(_quote.symbol)) {
    //     return _quote
    //   } else {

    //     return quote
    //   }
    // })
    console.log(quotes)
  }
  
  return (
    <div className="main-x">
      <div className="top-x">
        <QuotePanes />
        <TopRPanes />
        {/* <div className="right-x card-container">
          <CardTabs initialPanes={topRPanes}></CardTabs>
        </div> */}
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

export default MainPage