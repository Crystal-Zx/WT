import http from '../http.js'
import apis from '../api.js'

export function _getSymbols (params = {}) {
  return http.post(apis.getSymbols, params)
}
export function _login (params = {}) {
  console.log(params,params)
  return http.post(apis.login, params)
}