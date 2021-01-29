import { store } from '../store/store'
import { 
  login,
  setToken 
} from '../pages/MainPage/MainAction'

const { dispatch } = store

const user = {
  isLogin: () => {
    const { token } = store.getState().MainReducer
    return !!token
  },
  login: (params) => {
    return dispatch(login(params)).then(res => {
      const { token } = res.value
      console.log(token)
      !!token && user.setToken(token)
      sessionStorage.setItem("wt_token", token)
      sessionStorage.setItem("wt_userInfo", JSON.stringify(res.value))
    })
  },
  getToken: () => {
    const { token } = store.getState().MainReducer
    // console.log("====user getToken", token)
    return token
  },
  setToken: (token) => {
    dispatch(setToken(token))
  }
}

export default user