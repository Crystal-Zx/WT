import * as React from 'react';
import './TVChartContainer.scss';
import {
  widget
} from '../../../../charting_library.min'
import Datafeed from './datafees'
import { connect } from 'react-redux';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVChartContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.tvWidget = null
    this.socket = props.socket
    this.datafeeds = new Datafeed(this)
    this.widgets = null
    this.symbol = props.symbol || 'EURUSD'
    this.interval = props.resolution || '1'
    this.cacheData = {}
    this.lastTime = null
    this.getBarTimer = null
    this.isLoading = true
    this.isHistory = {}
    this.paramary = {}
    this.onShowTradeModal = props.onShowTradeModal

    this.init = this.init.bind(this)
    this.initMessage = this.initMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.getklinelist = this.getklinelist.bind(this)
    this.initLimit = this.initLimit.bind(this)
    this.getBars = this.getBars.bind(this)
    this.onMessage = this.onMessage.bind(this)
    this.unSubscribe = this.unSubscribe.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.onClose = this.onClose.bind(this)

    const that = this 
    !this.socket.checkOpen() && this.socket.doOpen()
    // this.socket.on('open', that.getklinelist.bind(this)
    //   // function () {
    //   //   //页面初始化的时候，为了快速加载，先请求150条记录
    //   //   if (that.interval < 60) {
    //   //     that.socket.send({
    //   //       cmd: 'req',
    //   //       args: ["candle.M" + that.interval + "." + that.symbol]
    //   //     })
    //   //   } else if (that.interval >= 60) {
    //   //     that.socket.send({
    //   //       cmd: 'req',
    //   //       args: ["candle.H" + (that.interval / 60) + "." + that.symbol]
    //   //     })
    //   //   } else {
    //   //     that.socket.send({
    //   //       cmd: 'req',
    //   //       args: ["candle.D1." + that.symbol]
    //   //     })
    //   //   }
    //   // }
    // )
    this.socket.on('kLine', that.onMessage.bind(this))
    this.socket.on('close', that.onClose.bind(this))
  }

  init = () => {
    const that = this
    if (!this.tvWidget) {
      this.tvWidget = new widget({
        symbol: this.symbol, // 图表的初始商品
        interval: this.interval, // 图表的初始周期
        allow_symbol_change: true,
        container_id: 'tv_chart_container',
        datafeed: this.datafeeds,
        library_path: '/charting_library/', // static文件夹的路径              
        timezone: 'Asia/Shanghai',
        autosize: true,
        // custom_css_url: '../../../../../public/tv.module.scss',  // 本地css样式，放在public下（1.14+支持）
        locale: getLanguageFromURL() || 'zh', // 图表的本地化处理
        toolbar_bg: '#fff0',
        loading_screen: {
          backgroundColor: '#fff0'
        },
        // studies_overrides: {
        //   'volume.volume.color.0': 'rgba(29, 178, 112,1)',
        //   'volume.volume.color.1': 'rgba(239, 64, 52, 1)'
        // },
        // overrides: that.getOverrides(theme),  // 1.12版本设置overrides无效！！！使用applyOverrides
        enabled_features: [ // 在默认情况下启用/禁用（disabled_features）名称的数组
          'left_toolbar',
          'side_toolbar_in_fullscreen_mode', // 全屏模式启用绘图工具
          'keep_left_toolbar_visible_on_small_screens' // 防止左侧工具栏在小屏幕上小时
        ],
        disabled_features: [
          'header_symbol_search', // 品种搜索框
          'header_saveload', // "保存/加载图表"按钮
          'header_screenshot', // 截屏按钮
          'header_chart_type', // 显示“图表类型”按钮
          'header_compare',
          'header_undo_redo', // 撤销/重做按钮
          'timeframes_toolbar',
          // 'volume_force_overlay',  // 在主数据量列的窗格上放置成交量指标
          'header_resolutions',
        ],
        debug: true
      })
    }
    const thats = this.tvWidget;

    thats.onChartReady(function () {
      // console.log(document.querySelector(".TVChartContainer iframe"))
      // const tvcIframe = document.querySelector(".TVChartContainer iframe")
      // const head = tvcIframe.contentWindow.document.body
      // console.log(document.getElementById('tv_chart_container').childNodes[0])
      // document.getElementById('tv_chart_container').childNodes[0].setAttribute("style", "display: block;width: 100%;height: 100%;")
      createButton(buttons)
      // 设定图表自定义样式
      thats.applyOverrides(that.getOverrides(that.props.theme))
      // thats.changeTheme("light")
    })

    // chartType: 0 => Bar; 1 => Candle; 2 => Line; 3 => Area
    var buttons = [{
        title: '1m',
        resolution: '1',
        chartType: 1
      },
      {
        title: '15m',
        resolution: '15',
        chartType: 1
      },
      {
        title: '1h',
        resolution: '60',
        chartType: 1
      },
      // {title:'H4',resolution:'240',chartType:1},
      {
        title: '1d',
        resolution: '1D',
        chartType: 1
      },
      {
        title: 'SL/TP'
      }
      // {title:'W1',resolution:'1W',chartType:1},
      // {title:'MN',resolution:'1M',chartType:1},
    ];

    // 创建按钮(这里是时间维度)，并对选中的按钮加上样式
    function createButton(buttons) {
      const resolutionBtns = buttons.slice(0, 4)
      // 创建时间维度按钮组
      for (var i = 0; i < resolutionBtns.length; i++) {
        (function (button) {
          let defaultClass =
            thats.createButton()
            .attr('title', button.title)
            .attr('data-rsl', button.resolution).addClass(`rsl-date ${button.resolution === that.paramary.resolution ? 'active' : ''}`)
            .text(button.title)
            .on('click', function (e) {
              if (this.className.indexOf('active') > -1) { // 已经选中
                return false
              }
              let curent = e.currentTarget.parentNode.parentNode.childNodes
              for (let index of curent) {
                if (index.className.indexOf('rsl-group') > -1 && index.childNodes[0].className.indexOf('active') > -1) {
                  index.childNodes[0].className = index.childNodes[0].className.replace('active', '')
                }
              }
              this.className = `${this.className} active`
              thats.chart().setResolution(button.resolution, function onReadyCallback() {
                that.props.onChangeResolution(button.resolution)
              })
            }).parent().addClass('rsl-group' + (button.resolution == that.paramary.resolution ? ' active' : ''))
        })(resolutionBtns[i])
      }
      // 创建弹窗下单弹窗按钮
      const stBtn = buttons.slice(4,5)[0]
      console.log(stBtn)
      thats.createButton().text(stBtn.title)
      .on('click', function (e) {
        that.onShowTradeModal()
      })
    }
  }

  initMessage = (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) => {
    // console.log("=======initMsg")
    let that = this
    //保留当前回调
    that.cacheData['onLoadedCallback'] = onLoadedCallback;
    //获取需要请求的数据数目
    let limit = that.initLimit(resolution, rangeStartDate, rangeEndDate)
    //如果当前时间节点已经改变，停止上一个时间节点的订阅，修改时间节点值
    if (that.interval !== resolution) {
      that.unSubscribe(that.interval)
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
    // if (this.isHistory.isRequestHistory) {
    //   param = {
    //     // 获取历史记录时的参数(与全部主要区别是时间戳)
    //   }
    // } else {
    //   param = {
    //     // 获取全部记录时的参数
    //   }
    // }
    this.getklinelist(param)
  }

  sendMessage = (data) => {
    var that = this;
    // console.log("这是要发送的数据：" + JSON.stringify(data))
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
    // this.interval = resolution
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
    // console.log("====tvc data:", data)
    let that = this
    // 计算当前resolution
    let _type = data.data.ticks ? data.data.id : data.data.type
    data.resolution = that.getResolutionByCh(_type.split(".")[1])
    // 引入新数据的原因，是我想要加入缓存，这样在大数据量的时候，切换时间维度可以大大的优化请求时间
    let newdata = []
    // if (data.data || data.data.ticks) {
    if (data.data.ticks) {
      data.data.ticks.forEach(tick => {
        newdata.push({
          time: tick.id * 1000,
          open: tick.open,
          high: tick.high,
          low: tick.low,
          close: tick.close,
          volume: tick.quote_vol || 0
        })
      }, that);
    } else {
      newdata[0] = data.data
    }
    // }
    const ticker = `${that.symbol}-${that.interval}`
    // 第一次全部更新(增量数据是一条一条推送，等待全部数据拿到后再请求)
    if (newdata && newdata.length >= 1 && !that.cacheData[ticker]) { //  && data.firstHisFlag === 'true'
      // websocket返回的值，数组代表时间段历史数据，不是增量
      var tickerstate = `${ticker}state`,
        tickerCallback = `${ticker}Callback`,
        onLoadedCallback = that.cacheData[onLoadedCallback]
      // 如果没有缓存数据，则直接填充，发起订阅
      if (!that.cacheData[ticker]) {
        that.cacheData[ticker] = newdata
        that.subscribe() // 这里去订阅增量数据！！！！！！！
      }
      // 新数据即当前时间段需要的数据，直接喂给图表插件
      if (onLoadedCallback) {
        console.log("====newdata:", newdata)
        onLoadedCallback(newdata);
        delete that.cacheData[tickerCallback];
      }
      // 如果出现历史数据不见的时候，就说明 onLoadedCallback 是undefined
      if (that.cacheData['onLoadedCallback']) { // ToDo
        that.cacheData['onLoadedCallback'](newdata)
      }
      //请求完成，设置状态为false
      that.cacheData[tickerstate] = false
      //记录当前缓存时间，即数组最后一位的时间
      that.lastTime = that.cacheData[ticker][that.cacheData[ticker].length - 1].time
    }
    // 更新历史数据 (这边是添加了滑动按需加载，后面我会说明)
    if (newdata && newdata.length > 1 && data.type === "update" && this.paramary.resolution === data.resolution && that.cacheData[ticker] && this.isHistory.isRequestHistory) { //  && this.paramary.klineId === data.klineId && data.firstHisFlag === 'true'
      that.cacheData[ticker] = newdata.concat(that.cacheData[ticker])
      this.isHistory.isRequestHistory = false
    }
    // 单条数据()
    if (newdata && newdata.length === 1 && this.paramary.resolution === data.resolution) { // && data.klineId === this.paramary.klineId && data.hasOwnProperty('firstHisFlag') === false
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
      if (barsData.time > that.lastTime && that.cacheData[ticker] && that.cacheData[ticker].length) {
        //增量更新的数据直接加入缓存数组
        that.cacheData[ticker].push(barsData)
        //修改缓存时间
        that.lastTime = barsData.time
      } else if (barsData.time == that.lastTime && that.cacheData[ticker] && that.cacheData[ticker].length) {
        //如果增量更新的时间等于缓存时间，即在当前时间颗粒内产生了新数据，更新当前数据
        that.cacheData[ticker][that.cacheData[ticker].length - 1] = barsData
      }
      // 通知图表插件，可以开始增量更新的渲染了
      that.datafeeds.barsUpdater.updateData()
    }
  }

  unSubscribe = (interval) => {
    // console.log("======unSubscribe")
    var that = this;
    //停止订阅，删除过期缓存、缓存时间、缓存状态
    var ticker = that.symbol + "-" + interval;
    var tickertime = ticker + "load";
    var tickerstate = ticker + "state";
    var tickerCallback = ticker + "Callback";
    delete that.cacheData[ticker];
    delete that.cacheData[tickertime];
    delete that.cacheData[tickerstate];
    delete that.cacheData[tickerCallback];
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
    var that = this;
    console.log(' >> : 连接已断开... 正在重连')
    that.socket.doOpen()
    that.socket.on('open', function () {
      console.log(' >> : 已重连')
      that.subscribe()
    });
  }

  getResolutionByCh = (resolutionCh) => {
    let resolution
    // if(!isNaN(Number(resolutionCh))) {
    //   resolution = resolutionCh
    // } else {
    resolutionCh = resolutionCh.toUpperCase()
    if (resolutionCh.indexOf("M") > -1) {
      resolution = resolutionCh.slice(1)
    } else if (resolutionCh.indexOf("H") > -1) {
      resolution = resolutionCh.slice(1) * 60
    } else if (resolutionCh.indexOf("D") > -1) {
      resolution = resolutionCh.slice(1) + "D"
    }
    // }
    return resolution + ""
  }

  getOverrides = (theme) => {
    var themes = {
      "light": {
        up: "#00b276",
        down: "#fc3131",
        bg: "#fff",
        grid: "#dadde0",
        cross: "#23283D",
        upBorder: "#18734c",
        downBorder: "#a61f2b",
        border: "#dadde0",
        text: "#363636",
        areatop: "rgba(0, 178, 118, 0.1)",
        areadown: "rgba(252, 49, 49, 0.02)",
        line: "#737375"
      },
      "dark": {
        //url: "night.css",
        up: "#24a06b",     // 上行蜡烛颜色，"#589065",
        down: "#cc2e3c",   // 下行蜡烛颜色，"#ae4e54",
        bg: "#152126",
        grid: "#1f292f",   // 网格线
        cross: "#43545e",  // 鼠标悬浮的十字线
        upBorder: "#2ec886",
        downBorder: "#ff3a4c",
        border: "#f00",
        text: "#fff",
        areatop: "rgba(36, 160, 107, .1)",
        areadown: "rgba(204, 46, 60, .02)",
        line: "#737375"
      }
    };
    var t = themes[theme];
    return {
      // 坐标轴和刻度标签颜色
      "scalesProperties.lineColor": t.grid,
      "scalesProperties.textColor": t.text,
      "paneProperties.background": t.bg,  // charts区域背景色
      "paneProperties.vertGridProperties.color": t.grid,
      "paneProperties.horzGridProperties.color": t.grid,
      "paneProperties.crossHairProperties.color": t.cross,
      "paneProperties.legendProperties.showLegend": !!t.showLegend,
      "paneProperties.legendProperties.showStudyArguments": !0,
      "paneProperties.legendProperties.showStudyTitles": !0,
      "paneProperties.legendProperties.showStudyValues": !0,
      "paneProperties.legendProperties.showSeriesTitle": !0,
      "paneProperties.legendProperties.showSeriesOHLC": !0,
      // K线蜡烛图
      "mainSeriesProperties.candleStyle.upColor": t.up,
      "mainSeriesProperties.candleStyle.downColor": t.down,
      "mainSeriesProperties.candleStyle.drawWick": !0,  // 烛心：即蜡烛柱中间竖着的那根线
      "mainSeriesProperties.candleStyle.drawBorder": !0,
      "mainSeriesProperties.candleStyle.borderColor": t.border,
      "mainSeriesProperties.candleStyle.borderUpColor": t.upBorder,
      "mainSeriesProperties.candleStyle.borderDownColor": t.downBorder,
      "mainSeriesProperties.candleStyle.wickUpColor": t.upBorder,
      "mainSeriesProperties.candleStyle.wickDownColor": t.downBorder,
      "mainSeriesProperties.candleStyle.barColorsOnPrevClose": !1,
      // 空心K线蜡烛图
      "mainSeriesProperties.hollowCandleStyle.upColor": t.up,
      "mainSeriesProperties.hollowCandleStyle.downColor": t.down,
      "mainSeriesProperties.hollowCandleStyle.drawWick": !0,
      "mainSeriesProperties.hollowCandleStyle.drawBorder": !0,
      "mainSeriesProperties.hollowCandleStyle.borderColor": t.border,
      "mainSeriesProperties.hollowCandleStyle.borderUpColor": t.up,
      "mainSeriesProperties.hollowCandleStyle.borderDownColor": t.down,
      "mainSeriesProperties.hollowCandleStyle.wickColor": t.line,
      "mainSeriesProperties.haStyle.upColor": t.up,
      "mainSeriesProperties.haStyle.downColor": t.down,
      "mainSeriesProperties.haStyle.drawWick": !0,
      "mainSeriesProperties.haStyle.drawBorder": !0,
      "mainSeriesProperties.haStyle.borderColor": t.border,
      "mainSeriesProperties.haStyle.borderUpColor": t.up,
      "mainSeriesProperties.haStyle.borderDownColor": t.down,
      "mainSeriesProperties.haStyle.wickColor": t.border,
      "mainSeriesProperties.haStyle.barColorsOnPrevClose": !1,
      "mainSeriesProperties.barStyle.upColor": t.up,
      "mainSeriesProperties.barStyle.downColor": t.down,
      "mainSeriesProperties.barStyle.barColorsOnPrevClose": !1,
      "mainSeriesProperties.barStyle.dontDrawOpen": !1,
      "mainSeriesProperties.lineStyle.color": t.border,
      "mainSeriesProperties.lineStyle.linewidth": 1,
      "mainSeriesProperties.lineStyle.priceSource": "close",
      "mainSeriesProperties.areaStyle.color1": t.areatop,
      "mainSeriesProperties.areaStyle.color2": t.areadown,
      "mainSeriesProperties.areaStyle.linecolor": t.border,
      "mainSeriesProperties.areaStyle.linewidth": 1,
      "mainSeriesProperties.areaStyle.priceSource": "close"
    }
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  // 当props中的symbol或resolution改变时，更新图表
  componentDidUpdate(prevProps) {
    const that = this
    if(prevProps.symbol !== that.props.symbol) {
      // 取消上一个货币对的订阅
      this.unSubscribe(this.interval)
      // 更新当前symbol
      this.symbol = this.props.symbol
      // 通知图标symbol更新
      this.tvWidget.chart().setSymbol(this.symbol.toUpperCase(), function onReadyCallback() {})
      if (prevProps.resolution !== this.props.resolution) {
        // 当切换symbol时，将时间周期切换至其上一次选中值resolution
        const tvIframeName = document.querySelector("#tv_chart_container iframe").name
        const tvIframe = document.getElementById(tvIframeName).contentWindow
        const el = tvIframe.document.querySelector(`.header-chart-panel-content .rsl-group .rsl-date[data-rsl='${this.props.resolution}']`)
        const evt = document.createEvent("MouseEvents")
        evt.initEvent("click", false, true)
        el.dispatchEvent(evt)
      }
    }
    if(Object.keys(prevProps.socket) === 0 && Object.keys(prevProps.socket) !== Object.keys(that.props.socket)) {
      console.log("socket changed!, the value of socket this time is: ", that.props.socket)
    }
    if(prevProps.theme !== that.props.theme) {
      that.tvWidget.applyOverrides(that.getOverrides(that.props.theme))
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

export default connect(
  state => ({
    socket: state.MainReducer.initSocket,
    theme: state.MainReducer.theme
  })
)(TVChartContainer)