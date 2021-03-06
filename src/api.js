const prefix = '' // api地址前缀

export default(config => {
  return Object.keys(config).reduce((copy, name) => {
    copy[name] = `${prefix}${config[name]}`
    return copy
  }, {})
})({
  'getSymbols': '/v1/symbols',
  'login': '/v1/login',
  'loginOA1': 'https://v2.alphazone-data.cn/alpha/api/v2/getFireOffer',
  'loginOA2': 'https://v2.alphazone-data.cn/guest/api/v2/getFireOfferTwo',
  'getDate': 'https://v1.alphazone-data.cn/academy/api/v1/getdate',
  'getPositions': '/v1/position',
  'getHistories': '/v1/closed',
  'getAccountInfo': '/v1/account_info',
  'modifyOrder': '/v1/order/modify',
  'closeOrder': '/v1/order/close',
  'openOrder': '/v1/order/open',
  'getNewsData': 'https://www.jin10.com/flash_newest.js',
  'getSymbolInfo': '/v1/symbol_info'
})