import http from '../http.js'
import apis from '../api.js'

export function _getSymbols (params= {}) {
  return http.get(apis.getSymbols, params)
}