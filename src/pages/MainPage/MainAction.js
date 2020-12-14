import { createAction } from 'redux-actions'
import socket from '../../socket'

export const INIT_SOCKET = 'INIT_SOCKET'

export const initSocket = createAction(
  INIT_SOCKET, () => {
    var ws = new socket("ws://47.113.231.12:5885/")
    ws.doOpen()
    return ws
  }
)