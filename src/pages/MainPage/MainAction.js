import { createAction } from 'redux-actions'
import socket from '../../socket'

export const INIT_SOCKET = 'INIT_SOCKET'
export const ADD_TO_KLINE = 'ADD_TO_KLINE'
export const DELETE_FROM_KLINE = 'DELETE_FROM_KLINE'

export const initSocket = createAction(
  INIT_SOCKET, () => {
    var ws = new socket("ws://47.113.231.12:5885/")
    ws.doOpen()
    // console.log(ws)
    return ws
  }
)

export const addToKLine = createAction(
  ADD_TO_KLINE, symbol => symbol
)
export const deleteFromKLine = createAction(
  DELETE_FROM_KLINE, symbol => symbol
)