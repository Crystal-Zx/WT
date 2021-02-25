import { store } from '../store/store'
import { 
  login,
  loginOA1,
  loginOA2
} from '../pages/MainPage/MainAction'

const { dispatch } = store

function initOpt () {
  let cacheAccInfo = JSON.parse(sessionStorage.getItem("wt_accInfo"))
  let cacheCurrAcc = JSON.parse(sessionStorage.getItem("wt_currAcc"))

  if(!cacheAccInfo || !cacheAccInfo.length) {  // 没有账号列表缓存 ---> 未登录
    // this.option.currAcc = this.option.accInfo = null
    cacheAccInfo = cacheCurrAcc = null
    // return ({
    //   accInfo: cacheAccInfo,
    //   currAcc: cacheCurrAcc
    // })
  } else if(cacheAccInfo.length >= 1 && (!cacheCurrAcc || !Object.keys(cacheCurrAcc).length)) {  // 有账号列表缓存但当前没有选中账号  ---> 默认登录账号列表中的第一个账号
    // this.option.cacheCurrAcc = cacheAccInfo[0]
    cacheCurrAcc = cacheAccInfo[0]
    sessionStorage.setItem("wt_currAcc", JSON.stringify(cacheCurrAcc))
  }
  //  else {
  //   this.option.accInfo = cacheAccInfo
  //   this.option.currAcc = cacheCurrAcc
  // }
  return ({
    accInfo: cacheAccInfo,
    currAcc: cacheCurrAcc
  })
}

const user = {
  option: {
    // token: store.getState().MainReducer.token,
    accInfo: initOpt().accInfo,  //JSON.parse(sessionStorage.getItem("wt_accInfo")),// || [], 
    currAcc: initOpt().currAcc  //cacheCurrAcc && Object.keys(cacheCurrAcc).length ? cacheCurrAcc : (cacheAccInfo ? cacheAccInfo[0] : {}),
    // selectType: initOpt().selectType  // 1 -> demo; 2 -> live
  },
  isLogin: function () {
    return this.option.currAcc && Object.keys(this.option.currAcc).includes('token')
  },
  login: function (params, platform) {
    const that = this
    switch (platform) {
      case 'mt4':
        const { type = 1 } = params
        delete params.type
        return dispatch(login(params)).then(res => {
          const { login } = params
          const { token } = res.value
          const _currAcc = {
            account: login, token, type
          }
          // !!token && 
          that.setCurrAcc(that.option.currAcc)
          // that.option.currAcc = _currAcc
          that.option.accInfo = new Array(_currAcc)
          // sessionStorage.setItem("wt_token", token)
          // sessionStorage.setItem("wt_currAcc", JSON.stringify(that.option.currAcc))
          sessionStorage.setItem("wt_accInfo", JSON.stringify(that.option.accInfo))
          sessionStorage.setItem("wt_userInfo", JSON.stringify(res.value))
        })
      case 'oa1':
        /**
         * res.value 返回值格式：
         * [{
         *    account: "11456",
         *    token: "...",
         *    type: 1 (1 -> demo；2 -> live)
         * }]
         */
        return dispatch(loginOA1(params)).then(res => {
          that.setCurrAcc(res.value[0])
          // 改变本地值
          that.option.accInfo = res.value
          // 存入session以保证刷新页面不影响功能
          sessionStorage.setItem("wt_accInfo", JSON.stringify(res.value))

          return Promise.resolve()
        }).catch(err => {
          console.log(err)
          return Promise.reject(err)
        })
      case 'oa2':
        /**
         * res.value 返回值格式：
         * [{
         *    account: "11456",
         *    token: "...",
         *    type: 1 (1 -> demo；2 -> live)
         * }]
         */
        return dispatch(loginOA2(params)).then(res => {
          console.log(res)
          that.setCurrAcc(res.value[0])
          // 改变本地值
          // that.option.currAcc = res.value[0]
          that.option.accInfo = res.value
          // 改变redux中token的值以更新界面
          // that.setCurrAcc(that.option.currAcc)
          // 存入session以保证刷新页面不影响功能
          // sessionStorage.setItem("wt_token", token)
          // sessionStorage.setItem("wt_currAcc", JSON.stringify(that.option.currAcc))
          sessionStorage.setItem("wt_accInfo", JSON.stringify(res.value))
          return Promise.resolve()
        }).catch(err => {
          console.log(err)
          return Promise.reject(err)
        })
      default:
        break;
    }
  },
  getType: function () {
    return this.option.currAcc.type
  },
  getToken: function () {
    return this.option.currAcc ? this.option.currAcc.token : ''
  },
  // setToken: function (token) {
  //   this.option.token = token
  //   dispatch(setToken(token))
  // },
  getAccInfo: function () {
    return this.option.accInfo
  },
  getCurrAcc: function () {
    return this.option.currAcc
  },
  /**
   * 
   * @param {string | Object} currAcc string类型为account，Object类型为完整账号信息，格式为：
   * { account: '11456', token: 'dsfwefefer...', type: 1}
   */
  setCurrAcc: function (currAcc) {
    // this.option.currAcc = currAcc
    // sessionStorage.setItem("wt_currAcc", JSON.stringify(this.option.currAcc))
    // console.log("====setCurrAcc param:", JSON.stringify(store.getState().MainReducer.currAcc), JSON.stringify(currAcc), JSON.stringify(store.getState().MainReducer.currAcc) !== JSON.stringify(currAcc))

    // // 前后两次currAcc值不一致时才更新
    // if(JSON.stringify(store.getState().MainReducer.currAcc) !== JSON.stringify(currAcc)) {
      if(typeof currAcc === "string") {
        currAcc = this.option.accInfo.filter(item => item.account === currAcc)[0]
      }
      // 存本地：不刷新页面时的数据保持
      this.option.currAcc = currAcc
      // 存session：刷新页面时的数据保持
      sessionStorage.setItem("wt_currAcc", JSON.stringify(this.option.currAcc))
      // dispatch(setCurrAcc(currAcc))
    // }
  },
  // 账号相关
  getAxiosBaseUrl: function ()  {
    let type = 1
    if(sessionStorage.getItem("wt_selectType")) {
      type = sessionStorage.getItem("wt_selectType")
    } else if(this.option.currAcc) {
      type = this.option.currAcc.type || type
    }
    return Number(type) === 2 ? 'https://live.wt.alphazone.com.cn' : 'https://demo.wt.alphazone.com.cn'
  },
  getWSUrl: function () {
    let type = 1
    if(this.option.currAcc) {
      type = this.option.currAcc.type || type
    }
    return Number(type) === 2 ? 'wss://live.wt.alphazone.com.cn/ws' : 'wss://demo.wt.alphazone.com.cn/ws'
  }
}

export default user