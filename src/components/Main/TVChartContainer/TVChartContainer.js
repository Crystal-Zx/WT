import * as React from 'react';
import './TVChartContainer.css';
import {
  widget
} from '../../../charting_library.min'
import Datafeed from './datafees'
import socket from '../../../socket'
import throttle from 'lodash/throttle'

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    const symbol = props.symbol
    this.tvWidget = null
    this.socket = new socket("ws://47.113.231.12:5885/")
    this.datafeeds = new Datafeed(this)
    this.widgets = null
    this.symbol = symbol || 'EURUSD'
    this.interval = localStorage.getItem('tradingview.resolution') || '1'
    this.cacheData = {}
    this.lastTime = null
    this.getBarTimer = null
    this.isLoading = true
    this.isHistory = {}
    this.paramary = {}

    this.init = this.init.bind(this)

    const that = this
    this.socket.doOpen()
    this.socket.on('open', function () {
      //页面初始化的时候，为了快速加载，先请求150条记录
      if (that.interval < 60) {
        that.socket.send({
          cmd: 'req',
          args: ["candle.M" + that.interval + "." + that.symbol]
        })
      } else if (that.interval >= 60) {
        that.socket.send({
          cmd: 'req',
          args: ["candle.H" + (that.interval / 60) + "." + that.symbol]
        })
      } else {
        that.socket.send({
          cmd: 'req',
          args: ["candle.D1." + that.symbol]
        })
      }
    })
    this.socket.on('message', that.onMessage.bind(this))
    this.socket.on('close', that.onClose.bind(this))
  }

  init = () => {
    const that = this
    // var chartType = (localStorage.getItem('tradingview.chartType') || '1') * 1;
    if (!this.tvWidget) {
      this.tvWidget = new widget({
        autosize: true,
        symbol: this.symbol, // 图表的初始商品
        interval: this.interval, // 图表的初始周期
        container_id: 'tv_chart_container',
        datafeed: this.datafeeds,
        library_path: '/charting_library/', // static文件夹的路径              
        enabled_features: [], // 在默认情况下启用/禁用（disabled_features）名称的数组
        timezone: 'Asia/Shanghai',
        // custom_css_url: './css/tradingview_'+skin+'.css',  // 本地css样式，放在public下
        locale: getLanguageFromURL() || 'en', // 图表的本地化处理
        debug: false,
        disabled_features: [
          "header_symbol_search",
          "header_saveload",
          "header_screenshot",
          "header_chart_type",
          "header_compare",
          "header_undo_redo",
          "timeframes_toolbar",
          "volume_force_overlay",
          "header_resolutions",
        ]
      })
    }
    const thats = this.tvWidget;

    thats.onChartReady(function () {
      console.log("=============> onChartReady")
      createButton(buttons);
    })

    // chartType: 0 => Bar; 1 => Candle; 2 => Line; 3 => Area
    var buttons = [
      {title:'1m',resolution:'1',chartType:1},
      {title:'15m',resolution:'15',chartType:1},
      {title:'1h',resolution:'60',chartType:1},
      {title:'1D',resolution:'1D',chartType:1},
    ];

    // 创建按钮(这里是时间维度)，并对选中的按钮加上样式
    function createButton(buttons) {
      for (var i = 0; i < buttons.length; i++) {
        (function (button) {
          let defaultClass =
            thats.createButton()
            .attr('title', button.title).addClass(`mydate ${button.resolution === '15' ? 'active' : ''}`)
            .text(button.title)
            .on('click', function (e) {
              if (this.className.indexOf('active') > -1) { // 已经选中
                return false
              }
              let curent = e.currentTarget.parentNode.parentElement.childNodes
              for (let index of curent) {
                if (index.className.indexOf('my-group') > -1 && index.childNodes[0].className.indexOf('active') > -1) {
                  index.childNodes[0].className = index.childNodes[0].className.replace('active', '')
                }
              }
              this.className = `${this.className} active`
              thats.chart().setResolution(button.resolution, function onReadyCallback() {})
            }).parent().addClass('my-group' + (button.resolution == that.paramary.resolution ? ' active' : ''))
        })(buttons[i])
      }
    }
  }

  initMessage = (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) => {
    console.log("=======initMsg")
    let that = this
    //保留当前回调
    that.cacheData['onLoadedCallback'] = onLoadedCallback;
    //获取需要请求的数据数目
    let limit = that.initLimit(resolution, rangeStartDate, rangeEndDate)
    //如果当前时间节点已经改变，停止上一个时间节点的订阅，修改时间节点值
    if (that.interval !== resolution) {
      that.interval = resolution
      this.paramary.endTime = parseInt((Date.now() / 1000), 10)
    } else {
      this.paramary.endTime = rangeEndDate
    }
    //获取当前时间段的数据，在onMessage中执行回调onLoadedCallback
    this.paramary.limit = limit
    this.paramary.resolution = resolution
    let param
    // 分批次获取历史(这边区分了历史记录分批加载的请求)
    if (this.isHistory.isRequestHistory) {
      param = {
        // 获取历史记录时的参数(与全部主要区别是时间戳)
      }
    } else {
      param = {
        // 获取全部记录时的参数
      }
    }
    // this.getklinelist(param)
  }

  sendMessage = (data) => {
    var that = this;
    console.log("这是要发送的数据：" + JSON.stringify(data))
    if (this.socket.checkOpen()) {
      this.socket.send(data)
    } else {
      this.socket.on('open', function () {
        that.socket.send(data)
      })
    }
  }

  getklinelist = (param) => {
    const that = this
    if (that.interval < 60) {
      that.socket.send({
        cmd: 'req',
        args: ["candle.M" + that.interval + "." + that.symbol]
      })
    } else if (that.interval >= 60) {
      that.socket.send({
        cmd: 'req',
        args: ["candle.H" + (that.interval / 60) + "." + that.symbol]
      })
    } else {
      that.socket.send({
        cmd: 'req',
        args: ["candle.D1." + that.symbol]
      })
    }
  }

  initLimit = (resolution, rangeStartDate, rangeEndDate) => {
    var limit = 0;
    switch (resolution) {
      case '1D':
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / 60 / 24);
        break;
      case '1W':
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / 60 / 24 / 7);
        break;
      case '1M':
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / 60 / 24 / 31);
        break;
      default:
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / resolution);
        break;
    }
    return limit;
  }

  getBars = (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) => {
    const timeInterval = resolution // 当前时间维度
    // console.log("resolution = ",resolution)
    this.interval = resolution
    let ticker = `${this.symbol}-${resolution}`
    let tickerload = `${ticker}load`
    var tickerstate = `${ticker}state`
    this.cacheData[tickerload] = rangeStartDate

    // 如果缓存没有数据，而且未发出请求，记录当前节点开始时间
    // 切换时间或币种
    if (!this.cacheData[ticker] && !this.cacheData[tickerstate]) {
      this.cacheData[tickerload] = rangeStartDate
      //发起请求，从websocket获取当前时间段的数据
      this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
      //设置状态为true
      this.cacheData[tickerstate] = true
    }
    if (!this.cacheData[tickerload] || this.cacheData[tickerload] > rangeStartDate) {
      //如果缓存有数据，但是没有当前时间段的数据，更新当前节点时间
      this.cacheData[tickerload] = rangeStartDate;
      //发起请求，从websocket获取当前时间段的数据
      this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback);
      //设置状态为true
      this.cacheData[tickerstate] = !0;
    }
    //正在从websocket获取数据，禁止一切操作
    if (this.cacheData[tickerstate]) {
      return false
    }
    // 拿到历史数据，更新图表
    if (this.cacheData[ticker] && this.cacheData[ticker].length > 1) {
      this.isLoading = false
      onLoadedCallback(this.cacheData[ticker])
    } else {
      let self = this
      this.getBarTimer = setTimeout(function () {
        self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
      }, 10)
    }
    // 这里很重要，画圈圈----实现了往前滑动，分次请求历史数据，减小压力
    // 根据可视窗口区域最左侧的时间节点与历史数据第一个点的时间比较判断，是否需要请求历史数据
    if (this.cacheData[ticker] && this.cacheData[ticker].length > 1 && this.widgets && this.widgets._ready && timeInterval !== '1D') {
      const rangeTime = this.widgets.chart().getVisibleRange() // 可视区域时间值(秒) {from, to}
      const dataTime = this.cacheData[ticker][0].time // 返回数据第一条时间
      if (rangeTime.from * 1000 <= dataTime + 28800000) { // true 不用请求 false 需要请求后续
        this.isHistory.endTime = dataTime / 1000
        this.isHistory.isRequestHistory = true
        // 发起历史数据的请求
        this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
      }
    }
  }

  // 渲染数据
  onMessage = (data) => { // 通过参数将数据传递进来    
    let thats = this
    if (data === []) {
      return
    }
    // 计算当前resolution
    let _type = data.data.ticks ? data.data.id : data.data.type
    data.resolution = _type.split(".")[1].slice(1)
    // 引入新数据的原因，是我想要加入缓存，这样在大数据量的时候，切换时间维度可以大大的优化请求时间
    let newdata = []
    // if (data.data || data.data.ticks) {
      if(data.data.ticks) {
        data.data.ticks.forEach(tick => {
          newdata.push({
            time: tick.id * 1000,
            open: tick.open,
            high: tick.high,
            low: tick.low,
            close: tick.close,
            volume: tick.quote_vol || 0
          })
        }, thats);
      } else {
        newdata[0] = data.data
      }
    // }
    const ticker = `${thats.symbol}-${thats.interval}`
    // 第一次全部更新(增量数据是一条一条推送，等待全部数据拿到后再请求)
    if (newdata && newdata.length >= 1 && !thats.cacheData[ticker]) {  //  && data.firstHisFlag === 'true'
      // websocket返回的值，数组代表时间段历史数据，不是增量
      var tickerstate = `${ticker}state`,
          tickerCallback = `${ticker}Callback`,
          onLoadedCallback = thats.cacheData[onLoadedCallback]
      // 如果没有缓存数据，则直接填充，发起订阅
      if (!thats.cacheData[ticker]) {
        thats.cacheData[ticker] = newdata
        thats.subscribe() // 这里去订阅增量数据！！！！！！！
      }
      // 新数据即当前时间段需要的数据，直接喂给图表插件
      if (onLoadedCallback) {
        onLoadedCallback(newdata);
        delete thats.cacheData[tickerCallback];
      }
      // 如果出现历史数据不见的时候，就说明 onLoadedCallback 是undefined
      if (thats.cacheData['onLoadedCallback']) { // ToDo
        thats.cacheData['onLoadedCallback'](newdata)
      }
      //请求完成，设置状态为false
      thats.cacheData[tickerstate] = false
      //记录当前缓存时间，即数组最后一位的时间
      thats.lastTime = thats.cacheData[ticker][thats.cacheData[ticker].length - 1].time
    }
    // 更新历史数据 (这边是添加了滑动按需加载，后面我会说明)
    if (newdata && newdata.length > 1 && data.type === "update" && this.paramary.resolution === data.resolution && thats.cacheData[ticker] && this.isHistory.isRequestHistory) {  //  && this.paramary.klineId === data.klineId && data.firstHisFlag === 'true'
      thats.cacheData[ticker] = newdata.concat(thats.cacheData[ticker])
      this.isHistory.isRequestHistory = false
    }
    // 单条数据()
    if (newdata && newdata.length === 1 && this.paramary.resolution === data.resolution) {  // && data.klineId === this.paramary.klineId && data.hasOwnProperty('firstHisFlag') === false
      //构造增量更新数据
      let barsData = {
        time: data.data.id * 1000,
        open: data.data.open,
        high: data.data.high,
        low: data.data.low,
        close: data.data.close,
        volume: data.data.quote_vol
      }
      //如果增量更新数据的时间大于缓存时间，而且缓存有数据，数据长度大于0
      if (barsData.time > thats.lastTime && thats.cacheData[ticker] && thats.cacheData[ticker].length) {
        //增量更新的数据直接加入缓存数组
        thats.cacheData[ticker].push(barsData)
        //修改缓存时间
        thats.lastTime = barsData.time
      } else if (barsData.time == thats.lastTime && thats.cacheData[ticker] && thats.cacheData[ticker].length) {
        //如果增量更新的时间等于缓存时间，即在当前时间颗粒内产生了新数据，更新当前数据
        thats.cacheData[ticker][thats.cacheData[ticker].length - 1] = barsData
      }
      // 通知图表插件，可以开始增量更新的渲染了
      thats.datafeeds.barsUpdater.updateData()
    }
  }

  unSubscribe = (interval) => {
    var thats = this;
    //停止订阅，删除过期缓存、缓存时间、缓存状态
    var ticker = thats.symbol + "-" + interval;
    var tickertime = ticker + "load";
    var tickerstate = ticker + "state";
    var tickerCallback = ticker + "Callback";
    delete thats.cacheData[ticker];
    delete thats.cacheData[tickertime];
    delete thats.cacheData[tickerstate];
    delete thats.cacheData[tickerCallback];
    if (interval < 60) {
      this.sendMessage({
        cmd: 'unsub',
        args: ["candle.M" + interval + "." + this.symbol.toUpperCase()]
      })
    } else if (interval >= 60) {
      this.sendMessage({
        cmd: 'unsub',
        args: ["candle.H" + (interval / 60) + "." + this.symbol.toUpperCase()]
      })
    } else {
      this.sendMessage({
        cmd: 'unsub',
        args: ["candle.D1." + this.symbol.toUpperCase()]
      })
    }
  }
  subscribe = () => {
    if (this.interval < 60) {
      this.sendMessage({
        cmd: 'sub',
        args: ["candle.M" + this.interval + "." + this.symbol.toUpperCase()],
      })
    } else if (this.interval >= 60) {
      this.sendMessage({
        cmd: 'sub',
        args: ["candle.H" + (this.interval / 60) + "." + this.symbol.toUpperCase()],
      })
    } else {
      this.sendMessage({
        cmd: 'sub',
        args: ["candle.D1." + this.symbol.toUpperCase()],
      })
    }
  }

  onClose = () => {
    var thats = this;
    console.log(' >> : 连接已断开... 正在重连')
    thats.socket.doOpen()
    thats.socket.on('open', function () {
      console.log(' >> : 已重连')
      thats.subscribe()
    });
  }

  componentDidMount() {
    console.log("==========componentDidMount")
    this.init()
    // this.initMessage()
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
		return (
			<div
				id="tv_chart_container"
				className="TVChartContainer"
        style={{ flex: 1 }}
			/>
		);
	}

}