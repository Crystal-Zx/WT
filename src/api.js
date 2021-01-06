const prefix = '' // api地址前缀

export default(config => {
  return Object.keys(config).reduce((copy, name) => {
    copy[name] = `${prefix}${config[name]}`
    return copy
  }, {})
})({
  'getSymbols': '/v1/symbols',
  'login': '/v1/login',
  'getPositions': '/v1/position',
  'getHistories': '/v1/closed',
  'getAccountInfo': '/v1/account_info',
  'modifyOrder': '/v1/order/modify',
})