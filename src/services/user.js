import { store } from '../store/store'
import { 
  login,
  loginOA2,
  setCurrAcc
} from '../pages/MainPage/MainAction'

const { dispatch } = store

const cacheAccInfo = JSON.parse(sessionStorage.getItem("wt_accInfo"))  // store.getState().MainReducer.currAcc || store.getState().MainReducer.currAcc || 

const user = {
  option: {
    // token: store.getState().MainReducer.token,
    currAcc: cacheAccInfo ? cacheAccInfo[0] : {},
    accInfo: cacheAccInfo || [], 
    type: 1  // 1 -> demo; 2 -> live
  },
  isLogin: function () {
    return !!this.option.currAcc.token
  },
  login: function (params, platform) {
    const that = this
    switch (platform) {
      case 'mt4':
        return dispatch(login(params)).then(res => {
          const { login } = params
          const { token, type = 1 } = res.value
          const _currAcc = {
            account: login, token, type
          }
          that.option.currAcc = _currAcc
          that.option.accInfo = new Array(_currAcc)
          // !!token && 
          that.setCurrAcc(that.option.currAcc)
          // sessionStorage.setItem("wt_token", token)
          sessionStorage.setItem("wt_currAcc", JSON.stringify(that.option.currAcc))
          sessionStorage.setItem("wt_accInfo", JSON.stringify(that.option.accInfo))
          sessionStorage.setItem("wt_userInfo", JSON.stringify(res.value))
        })
      case 'oa':
        /**
         * res.value 返回值格式：
         * [{
         *    account: "11456",
         *    token: "...",
         *    type: 1 (1 -> demo；2 -> live)
         * }]
         */
        return dispatch(loginOA2(params)).then(res => {
          console.log(res.value)
          // 改变本地值
          that.option.currAcc = res.value[0]
          that.option.accInfo = res.value
          // 改变redux中token的值以更新界面
          that.setCurrAcc(that.option.currAcc)
          // 存入session以保证刷新页面不影响功能
          // sessionStorage.setItem("wt_token", token)
          sessionStorage.setItem("wt_currAcc", JSON.stringify(that.option.currAcc))
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
    return this.option.type
  },
  getToken: function () {
    // console.log(this.option.currAcc || "")
    // const token = this.option.currAcc || ""
    return this.option.currAcc.token
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
    console.log("====setCurrAcc param:", JSON.stringify(store.getState().MainReducer.currAcc), JSON.stringify(currAcc), JSON.stringify(store.getState().MainReducer.currAcc) !== JSON.stringify(currAcc))

    // 前后两次currAcc值不一致时才更新
    if(JSON.stringify(store.getState().MainReducer.currAcc) !== JSON.stringify(currAcc)) {
      if(typeof currAcc === "string") {
        currAcc = this.option.accInfo.filter(item => item.account === currAcc)
      }
      // 存本地：不刷新页面时的数据保持
      this.option.currAcc = currAcc
      // 存session：刷新页面时的数据保持
      sessionStorage.setItem("wt_currAcc", JSON.stringify(this.option.currAcc))
      dispatch(setCurrAcc(currAcc))
    }
  },
  // 账号相关
  getAxiosBaseUrl: function ()  {
    return Number(this.option.type) === 2 ? 'https://live.wt.alphazone.com.cn' : 'https://demo.wt.alphazone.com.cn'
  },
  getWSUrl: function () {
    return Number(this.option.type) === 2 ? 'wss://live.wt.alphazone.com.cn/ws' : 'wss://demo.wt.alphazone.com.cn/ws'
  }
}

export default user