import axios from 'axios'

// 默认URL
axios.defaults.baseURL = 'http://47.113.231.12:6886'
// 允许跨域携带cookie
axios.defaults.withCredentials = true
// 超时时间
axios.defaults.timeout = 5000 // 5s
// 标识这是一个ajax请求
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers = {
  'Access-Control-Allow-Origin': '*',
  'Accept': 'MTE5MjI6MTYwNzM5ODc1Mjo5ODY3YWFiYTg4N2JkOWRiOTFiODFkZDQ3NzUzNzU2NA==',
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
}
// 请求拦截
axios.interceptors.request.use(
  config => {
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
    return Promise.reject(err)
  }
)
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