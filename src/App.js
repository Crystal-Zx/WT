import { useEffect } from 'react'
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';

import { HashRouter as Router, Route } from 'react-router-dom';

import { openNotificationWithIcon } from './utils/utilFunc'


function App(props) {

  const deviceDetection = () => {
    const UA = navigator.userAgent,
          isMobile = /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent),
          isAndroid = UA.indexOf('Android') > -1 || UA.indexOf('Adr') > -1, //android终端
          isIOS = !!UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    const clientWidth = document.body.clientWidth
    let deviceType
    if(!UA) {  // App
      deviceType = -1
    } else if(!isMobile) {  // PC
      deviceType = 0
    } else if(isMobile && isAndroid) {  // Android
      deviceType = 1
    } else if(isMobile && isIOS) {  // IOS
      deviceType = 2
    }
    if(!deviceType && clientWidth >= 1040) {
      return ({
        deviceType,
        res: true
      })
    }
    return ({
      deviceType,
      res: false
    })
  }

  useEffect(() => {
    const { deviceType, res } = deviceDetection()

    if(!res) {
      const desc = (
        <>
          { (deviceType > 0 || deviceType === -1) &&
            <p>检测到您当前的访问设备为移动端设备，不能获得本站的最佳浏览效果，如有需要请根据需求选择以下地址进行访问：</p>
          }
          { deviceType === 0 &&
            <>
              <p>请保证当前访问窗口大小在1040px以上，以获得本站最佳浏览效果。</p>
              <p>如有需要请根据需求选择以下地址进行访问：</p>
            </>
          }
          <ul>
            <li><a target="_blank" href="https://www.alphazone.com.cn/mobquotes.html">ALPHA ZONE移动端交易地址 &gt;&gt;</a></li>
            <li>
              火象交易APP下载：
              <div style={{ marginTop: '5px' }}>
                <div style={{ marginRight: '15px', display: 'inline-flex', flexDirection: 'column' }}>
                  <div>
                    <img width="100px" src="./img/qrcode_android_1.png" />
                  </div>
                  <span style={{ textAlign: 'center' }}>Android</span>
                </div>
                <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
                  <div>
                    <img width="100px" src="./img/qrcode_ios.png" />
                  </div>
                  <span style={{ textAlign: 'center' }}>IOS</span>
                </div>
              </div>
            </li>
          </ul>
        </>
      )
      openNotificationWithIcon({
        type: 'warning',
        msg: '访问友好度提示',
        desc,
        duration: 0
      })
    }
  }, [])

  return (
    <Router>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route exact path="/index" component={MainPage} />
    </Router>
  );
}


export default App
