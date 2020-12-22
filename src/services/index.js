import http from '../http.js'
import apis from '../api.js'

export function _login (params = {}) {
  return http.post(apis.login, params)
}
export function _getSymbols (params = {}) {
  return http.post(apis.getSymbols, params)
}
export function _getPositions (params = {}) {
  return http.post(apis.getPositions, params)
}