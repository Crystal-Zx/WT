import axios from 'axios'
import resolve from 'resolve'

// 默认URL
axios.defaults.baseURL = 'http://118.193.38.199:443'
// 允许跨域携带cookie
axios.defaults.withCredentials = true
// 超时时间
axios.defaults.timeout = 10000 // 10s
// 标识这是一个ajax请求
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// 请求拦截
axios.interceptors.request.use(config => {
  config.setHeaders([
    // 在这里设置请求头与携带token信息

  ])
  return config
})
// 相应拦截
// axios拦截器
axios.interceptors.response.use(response => {
  // 在这里你可以判断后台返回数据携带的请求码
  if (response.data.retcode === 200 || response.data.retcode === '200') {
    return response.data.data || response.data
  } else {
    // 非200请求抱错
    throw Error(response.data.msg || '服务异常')
  }
})

export default axios