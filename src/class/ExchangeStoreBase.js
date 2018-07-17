import StoreBase from '../core/StoreBase'
import Msg from "../config/ErrCodeConfig";

const WebsocketCallBackList = {}, websocketHistory = {}
let srartFlag = false


export default class ExchangeStoreBase extends StoreBase {
  constructor(modelName, connectName) {
    super();
    this.preHandler.push(this.exchangeStoreBasePreHandler);
    this.afterHandler.push(this.exchangeStoreBaseAfterHandler);
    // console.log(modelName)
    modelName && this.installProxy(modelName, this.preHandler, this.afterHandler)
    this.WebSocket = {}
    // console.log(modelName , connectName)
    modelName && connectName && this.installWebsocket(connectName, modelName)
  }

  exchangeStoreBasePreHandler(app, req, config) {
    let paramsObj = {
      action: config.action,
      data: req.data.params
    }
    req.data.params = paramsObj
    //添加token
    if (!config.needToken) return
    if (!req.data.params.data.token) return
    let headers = new Headers()
    headers.set('token', req.data.params.data.token)
    req.data.headers = headers;
    delete req.data.params.data.token
    // console.log('exchangeStoreBaseAfterHandler', app, req, res, config)
  }

  exchangeStoreBaseAfterHandler(app, req, res, config) {
    // console.log("res.result.ret", res.result.ret);

    if (res.result.ret !== 0) {
      // res.result = Msg[res.result.ret]
      res.result = res.result.data ? Object.assign(Msg[res.result.ret], res.result.data) : Msg[res.result.ret];
      return
    }
    if (res.result.action !== config.actionBack) {
      res.result = Msg[1];
      return
    }
    res.result = res.result.data
    // console.log('exchangeStoreBaseAfterHandler', app, req, res, config)
  }

  startWebsocket(websocket) {
    // websocket.send()
    // console.log('开启11', websocket)
    this.WebSocket.general.on('connect', data => {
      // console.log('this.WebSocket.general.on', data)
      this.Storage.websocketToken.set(data.token)
    })
    // websocket.send(websocket.config.optionList.global.connect)
    this.WebSocket.general.emit('connect', {token: this.Storage.websocketToken.get()})
    this.Loop.websocketHeartBreak.clear()
    this.Loop.websocketHeartBreak.setDelayTime(1)
    this.Loop.websocketHeartBreak.set(async () => {
      // console.log(websocket, '发心跳', websocket.config.optionList.global.heartBreak, websocket.send)
      // websocket.send(websocket.config.optionList.global.heartBreak)
      this.WebSocket.general.emit('heartBreak')
      await this.Sleep(5000)
    })
    this.Loop.websocketHeartBreak.start()
    // websocket.needStart = false
  }

  installWebsocket(connectName, modelName) {
    let websocket = super.installWebsocket(connectName)
    if (!websocket)
      return

    let headerConfig = Object.assign(websocket.config.optionList['global'], websocket.config.optionList[modelName])
    let opConfig = {}
    headerConfig && Object.keys(headerConfig).forEach(v => {
      opConfig[headerConfig[v].resOp] = v
    })
    // console.log('connectName, modelName', connectName, modelName, websocket)
    websocket.onMessage = data => {
      // console.log('installWebsocket(connectName, modelName)', data, data.op, opConfig, this.WebSocket[connectName], opConfig[data.op] && WebsocketCallBackList[opConfig[data.op]] && WebsocketCallBackList[opConfig[data.op]])
      let dataCacheErr =  data.body.data ? Object.assign(Msg[data.body.ret || 0], data.body.data) : Msg[data.body.ret || 0]
      let dataCache =  dataCacheErr || data.body
      opConfig[data.op] && WebsocketCallBackList[opConfig[data.op]] && WebsocketCallBackList[opConfig[data.op]](dataCache)
    }

    websocket.onClose(data => {
      console.log('websocket.onClose ', data)
      this.Loop.websocketHeartBreak.stop()
      this.Loop.websocketHeartBreak.clear()
      // websocket.needStart = true;
      websocket.onOpen(data => {
        // console.log('websocket.onOpen', data)
        this.startWebsocket(websocket)
        Object.keys(websocketHistory).forEach(v => websocketHistory[v].forEach(vv => websocket.send(vv)))

      })
    })

    websocket.onError(data => {
      console.log('websocket.onError ', data)
      this.Loop.websocketHeartBreak.stop()
      this.Loop.websocketHeartBreak.clear()
      // websocket.needStart = true;
      websocket.onOpen(data => {
        // console.log('websocket.onOpen', data)
        this.startWebsocket(websocket)
        websocketHistory.forEach(v => websocket.send(v))
      })
    })

    this.WebSocket[connectName] = {}

    this.WebSocket[connectName].emit = (key, data) => {

      // console.log('webSocketThis', this)
      // console.log('this.WebSocket[connectName]', websocket)
      headerConfig[key].seq = Math.floor(Math.random() * 1000000000)
      let emitData = Object.assign(headerConfig[key], {body: data})
      // console.log('emitData.console....................', JSON.stringify(emitData), connectName, key, data)
      websocket.send(this.Util.deepCopy(emitData))
      headerConfig[key].history && this.WebSocket[connectName].pushWebsocketHistoryArr(key, this.Util.deepCopy(data))
      // console.log('websocketHistory',websocketHistory)
    }
    this.WebSocket[connectName].on = (key, func) => {
      WebsocketCallBackList[key] = func
      // console.log(WebsocketCallBackList)
    }
    this.WebSocket[connectName].pushWebsocketHistoryArr = (key, value) => {
      headerConfig[key].seq = Math.floor(Math.random() * 1000000000)
      let emitData = Object.assign(headerConfig[key], {body: value})
      websocketHistory[key] = websocketHistory[key] || []
      websocketHistory[key].push(this.Util.deepCopy(emitData))
      // console.log('pushWebsocketHistoryArr', key, value, websocketHistory)
    }

    this.WebSocket[connectName].clearWebsocketHistoryArr = (key) => {
      // console.log('clearWebsocketHistoryArr', key, websocketHistory)
      websocketHistory[key] = []
    }

    if (!srartFlag) {
      this.startWebsocket(websocket)
      srartFlag = true
    }
  }
}