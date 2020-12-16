/**
 * JS API
 */
import React from 'react'
import DataUpdater from './dataUpdater'

class datafeeds extends React.Component {
  /**
   * JS API
   * @param {*Object} react react实例
   */
  constructor(self) {
    super(self)
    this.self = self
    this.barsUpdater = new DataUpdater(this)
    this.defaultConfiguration = this.defaultConfiguration.bind(this)
  }
  /**
   * 设置图表库支持的图表配置,图表库要求您使用回调函数来传递datafeed的 configurationData参数
   * @param {*Function} callback  回调函数
   * `onReady` should return result asynchronously.
   */
  onReady(callback) {
    console.log('=============onReady running')
    return new Promise((resolve) => {
      let configuration = this.defaultConfiguration()
      if (this.self.getConfig) {
        configuration = Object.assign(this.defaultConfiguration(), this.self.getConfig())
      }
      resolve(configuration)
    }).then(data => {
      callback(data)
    })
  }
  /**
   * @param {*Object} symbolInfo  商品信息对象
   * @param {*String} resolution  分辨率
   * @param {*Number} rangeStartDate  时间戳、最左边请求的K线时间
   * @param {*Number} rangeEndDate  时间戳、最右边请求的K线时间
   * @param {*Function} onDataCallback  回调函数
   * @param {*Function} onErrorCallback  回调函数
   */
  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback) {
    // console.log('=============getBars running',symbolInfo)
    const onLoadedCallback = (data) => {
      data && data.length ? onDataCallback(data, {
        noData: false
      }) : onDataCallback([], {
        noData: true
      })
    }
    this.self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
    /* eslint-enable */
  }
  /**
   * @param {*String} symbolName  商品名称或ticker
   * @param {*Function} onSymbolResolvedCallback 成功回调
   * @param {*Function} onResolveErrorCallback   失败回调
   * `resolveSymbol` should return result asynchronously.
   */
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const that = this
    return new Promise((resolve) => {
      // reject
      let symbolInfoName
      if (this.self.symbol) {
        symbolInfoName = this.self.symbol
      }
      let symbolInfo = {
        name: symbolInfoName,
        ticker: symbolInfoName, // 此商品的唯一标识符，用于所有数据请求；如未指定，则被视为等于symbol
        pricescale: 100000,     // 价格精度
      }
      const {
        symbolList
      } = that.props.props
      const array = symbolList.filter(item => item.symbol === symbolInfoName)
      if (array) {
        symbolInfo.pricescale = 10 ** array[0].pricePrecision
      }
      symbolInfo = Object.assign(this.defaultConfiguration(), symbolInfo)
      // console.log('=============resolveSymbol running', symbolInfo)
      resolve(symbolInfo)
    }).then(data => onSymbolResolvedCallback(data)).catch(err => onResolveErrorCallback(err))
  }
  /**
   * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
   * @param {*Object} symbolInfo 商品信息
   * @param {*String} resolution 分辨率
   * @param {*Function} onRealtimeCallback 回调函数
   * @param {*String} subscriberUID 监听的唯一标识符
   * @param {*Function} onResetCacheNeededCallback (从1.7开始): 将在bars数据发生变化时执行
   */
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    // console.log("subscriberUID: ",subscriberUID)
    this.barsUpdater.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)
  }
  /**
   * 取消订阅K线数据
   * @param {*String} subscriberUID 监听的唯一标识符
   */
  unsubscribeBars(subscriberUID) {
    this.barsUpdater.unsubscribeBars(subscriberUID)
  }
  /**
   * 默认配置
   */
  defaultConfiguration = () => {
    const object = {
      session: '24x7',  // 商品交易时间
      timezone: 'Asia/Shanghai',  // 这个商品的交易所时区
      minmov: 1,  // 最小波动，MinimalPossiblePriceChange（最小可能价格变动） = minmov / pricescale
      minmov2: 0,  // 不同种类价格最小波动参数，常见为0，ZFM2014五年期国债为4
      // description: 'www.coinoak.com',  // 商品说明,这个商品说明将被打印在图表的标题栏中
      pointvalue: 1,
      volume_precision: 4,  // 整数显示此商品的成交量数字的小数位。0表示只显示整数。
      hide_side_toolbar: false,  // 文档中没有找到相关参数，存疑。（修改值也没有起什么作用）
      fractional: false,
      supports_search: false,
      supports_group_request: false,
      supported_resolutions: ['1', '15', '60', '1D'],  // 支持的周期数组，周期可以是数字或字符串。 如果周期是一个数字，它被视为分钟数
      supports_marks: false,  // datafeed 是否支持在K线上显示标记
      supports_timescale_marks: false,  // 是否支持时间刻度标记。
      supports_time: true,  // 将此设置为true假如您的datafeed提供服务器时间（unix时间）。 它仅用于在价格刻度上显示倒计时
      has_intraday: true,
      intraday_multipliers: ['1', '15', '60', '1D'],
    }
    return object
  }
}

export default datafeeds