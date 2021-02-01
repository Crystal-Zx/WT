import { store } from '../store/store'
import { 
  login,
  loginOA,
  setToken 
} from '../pages/MainPage/MainAction'

const { dispatch } = store

const user = {
  option: {
    token: store.getState().MainReducer.token,
    isDemo: true
  },
  isLogin: function () {
    return !!this.option.token
  },
  login: function (params, platform) {
    switch (platform) {
      case 'mt4':
        return dispatch(login(params)).then(res => {
          const { token } = res.value
          
          !!token && user.setToken(token)
          sessionStorage.setItem("wt_token", token)
          sessionStorage.setItem("wt_userInfo", JSON.stringify(res.value))
        })
      case 'oa':
        return dispatch(loginOA(params)).then(res => {
          console.log(res.value)
        })
      default:
        break;
    }
    
  },
  getToken: function () {
    return this.option.token
  },
  setToken: function (token) {
    this.option.token = token
    dispatch(setToken(token))
  },
  // 账号相关
  getAxiosBaseUrl: function ()  {
    return !this.option.isDemo ? 'https://live.wt.alphazone.com.cn' : 'https://demo.wt.alphazone.com.cn'
  }
}

export default user