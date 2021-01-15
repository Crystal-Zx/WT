import axios from 'axios'

// 默认URL
axios.defaults.baseURL = 'http://156.226.24.38:61029'
// 允许跨域携带cookie
axios.defaults.withCredentials = false
// 超时时间
axios.defaults.timeout = 10000 // 5s
// 标识这是一个ajax请求
axios.defaults.headers = {
  'Accept': 'MTE5MjI6MTYxMDcwNTEzNzpjYmU0YzMyZDg5NzViZjQ1NTgzMjI1ZGYyOTBhM2RhZQ==',
  'Content-Type': 'application/x-www-form-urlencoded'
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
  const code = response.data.code
  if (code == 204 ) {
    throw Error('token过期')
  } else if(response.status == 200) {
    if(code == 1) {
      return response.data.data || response.data
    } else {
      throw response.data.msg
    }
  } else {
    // 非200请求抱错
    throw Error(response.data.msg || '服务异常')
    // throw Error(response.data.msg || '服务异常')
  }
})

export default axios