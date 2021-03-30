import axios from 'axios'
import { isJSON } from './utils/utilFunc'
import user from './services/user'

// 默认URL
axios.defaults.baseURL = user.getAxiosBaseUrl()
// 允许跨域携带cookie
axios.defaults.withCredentials = false
// 超时时间
axios.defaults.timeout = 10000 // 5s
// 标识这是一个ajax请求
axios.defaults.headers = {
  // 'Accept': user.getToken(),
  'Content-Type': 'application/x-www-form-urlencoded'
}
// 请求拦截
axios.interceptors.request.use(
  config => {
    // console.log(config)
    if(user.getToken()) {
      config.headers = {
        ...config.headers,
        'Accept': user.getToken()
      }
    }
    config.baseURL = user.getAxiosBaseUrl()
    // 格式化data参数
    const params = new URLSearchParams()
    for (const key in config.data) {
      if (config.data.hasOwnProperty(key)) {
        params.append(key, config.data[key])
      }
    }
    config.data = params
    return config
  },
  err => {
    // 这里极少情况会进来，暂时没有找到主动触发的方法，估计只有浏览器不兼容时才会触发，欢迎后面同学补充
    // 看了几个GitHub的issue，有人甚至提出了这个方法是不必要的（因为没有触发的场景），不过还是建议大家按照官方的写法，避免不必要的错误
    // 进来之后没法发起请求
    return Promise.reject(err)
  }
)
// 响应拦截
// axios拦截器
axios.interceptors.response.use(
  response => {
    // 这里会最先拿到你的response
    // 定制
    const extraUrl = /(jin10)/ig
    const isExtraUrlData = extraUrl.test(response.config.baseURL) || extraUrl.test(response.config.url)
    // 只有返回的状态码是2xx，都会进来这里
    if(response.status === 200) {
      const { code, status } = response.data
       
      if (code === 204 || status === 401) {  // token过期
        user.setCurrAcc({})
        return Promise.reject({ code, msg: 'token过期' })  // 会进入axios请求的catch
      } else if(code === 0 || (status && status !== 1)) {  // 请求正确发起，但返回值错误
        // console.log("请求正确发起，但返回值错误")
        return Promise.reject({ code, status, msg: response.data.msg })
      } else if(code === 1 || status === 1 || status === undefined || isExtraUrlData) {
        // console.log("请求正常返回")
        const { token } = response.data  // 针对登录接口返回的token
        let data = response.data.data || response.data
        data = isJSON(data) ? JSON.parse(data) : data
        if(data.length >= 0 || Object.keys(data).length > 0) {
          return token ? Object.assign({}, data, { token }) : data
        } else {
          return Promise.reject({ code, status, msg: response.data.msg })
        }
      } 
    } else {
      // 非200请求抱错
      // console.log("非200请求抱错")
      return Promise.reject(response.data.msg || '服务异常')
    }
  },
  error => {
    // 目前发现三种情况会进入这里：
    // 1. http状态码非2开头的都会进来这里，如404,500等
    // 2. 取消请求也会进入这里，CancelToken，可以用axios.isCancel(err)来判断是取消的请求
    // 3. 请求运行有异常也会进入这里，如故意将headers写错：axios.defaults.headers = '123',或者在request中有语法或解析错误也会进入这里
    // 进入这里意味着请求失败，axios会进入catch分支
    // console.log("===axios error", error, axios.isCancel(error))
    return Promise.reject(error)
  }
)

export default axios