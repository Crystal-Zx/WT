import axios from 'axios'
import { isJSON } from './utils/utilFunc'

// 默认URL
axios.defaults.baseURL = 'http://156.226.24.38:61029'
// 允许跨域携带cookie
axios.defaults.withCredentials = false
// 超时时间
axios.defaults.timeout = 10000 // 5s
// 标识这是一个ajax请求
axios.defaults.headers = {
  'Accept': 'MTE5MjI6MTYxMTY3MDI3MTo2YjdkZmRiMmI2OTk1ZGFlMjc4MmM4MzRkNzZlZWE1Zg==',
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
  let data = response.data.data || response.data
  data = isJSON(data) ? JSON.parse(data) : data
  if (code == 204 ) {
    throw Error('token过期')
  } else if(response.status == 200) {
    if(code == 1 || data.length >= 0 || Object.keys(data).length > 0) {
      return data
    } else {
      throw response.data.msg
    }
  } else {
    // 非200请求抱错
    throw Error(response.data.msg || '服务异常')
    // throw Error(response.data.msg || '服务异常')
  }
})

// jsonp
axios.jsonp = (url,data)=>{
  if(!url)
      throw new Error('url is necessary')
  const callback = 'CALLBACK' + Math.random().toString().substr(9,18)
  const JSONP = document.createElement('script')
        JSONP.setAttribute('type','text/javascript')

  const headEle = document.getElementsByTagName('head')[0]

  let ret = '';
  if(data){
      if(typeof data === 'string')
          ret = '&' + data;
      else if(typeof data === 'object') {
          for(let key in data)
              ret += '&' + key + '=' + encodeURIComponent(data[key]);
      }
      ret += '&_time=' + Date.now();
  }
  JSONP.src = `${url}?callback=${callback}${ret}`;
  return new Promise((resolve,reject) => {
      window[callback] = r => {
        console.log("====r", r)
        resolve(r)
        headEle.removeChild(JSONP)
        delete window[callback]
      }
      headEle.appendChild(JSONP)
  })
  
}


export default axios