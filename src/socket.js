class socket {
  constructor(urls) {
    this.heartBeatTimer = null
    this.urls = urls
    this.messageMap = {}
    this.connState = 0
    this.socket = null
  }
  doOpen() {
    if (this.connState) return
    this.connState = 1
    this.afterOpenEmit = []
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    const socketArg = new BrowserWebSocket(this.urls)
    socketArg.binaryType = 'arraybuffer'  // 显式指定收到的二进制数据类型为ArrayBuffer对象
    socketArg.onopen = evt => this.onOpen(evt)
    socketArg.onclose = evt => this.onClose(evt)
    socketArg.onmessage = evt => this.onMessage(evt.data)
    // socketArg.onerror = err => this.onError(err)
    this.socket = socketArg
    // 监听窗口关闭事件，当窗口关闭时，主动关闭ws连接，防止连接还没断开就关闭窗口，导致server端抛出异常
    window.onbeforeunload = () => { this.socket = null }
  }
  onOpen() {
    this.connState = 2
    this.heartBeatTimer = setInterval(this.checkHeartbeat.bind(this), 20000)
    this.onReceiver({
      Event: 'open'

    })
  }
  checkOpen() {
    return this.connState === 2
  }
  onClose(e) {
    console.log("socket onClose, the reason is:", e)
    this.connState = 0
    if (this.connState) {
      this.onReceiver({
        Event: 'close'
      })
    }
    if(e.code === 1006) {
      this.doOpen()
    }
  }
  send(data) {
    this.socket.send(JSON.stringify(data))
  }
  emit(data) {
    return new Promise((resolve) => {
      this.socket.send(JSON.stringify(data))
      this.on('message', (dataArray) => {
        resolve(dataArray)
      })
    })
  }
  onMessage(message) {
    try {
      const data = JSON.parse(message)
      const quoteType = ['symbol', 'quote', 'mini'],
            KLineTypes = ['req', 'update', 'req2'],
            orderType = ['order']  // 'quote'
      // if(data.type === 'symbol') {
      //   this.onReceiver({
      //     Event: 'symbol',
      //     Data: data
      //   })
      // }
      if(quoteType.includes(data.type)) {
        this.onReceiver({
          Event: 'quote',
          Data: data
        })
      }
      if(KLineTypes.includes(data.type)) {
        this.onReceiver({
          Event: 'kLine',
          Data: data
        })
      }
      if(orderType.includes(data.type)) {
        this.onReceiver({
          Event: 'order',
          Data: data
        })
      }
      // if(data.type === "order") {
      //   this.onReceiver({
      //     Event: 'orderChange',
      //     Data: data
      //   })
      // }
    } catch (err) {
      console.error(' >> Data parsing error:', err)
    }
  }
  checkHeartbeat() {
    const data = {
      cmd: 'ping',
      args: ['']
    }
    this.send(data)
  }
  onReceiver(data) {
    const callback = this.messageMap[data.Event]
    if (callback) callback(data.Data)
  }
  on(name, handler) {
    this.messageMap[name] = handler
  }
  doClose() {
    this.socket.close()
  }
  destroy() {
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer)
      this.heartBeatTimer = null
    }
    this.doClose()
    this.messageMap = {}
    this.connState = 0
    this.socket = null
  }
}
export default socket