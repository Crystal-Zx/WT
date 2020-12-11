import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware'
import { applyMiddleware, createStore } from 'redux'
import reducers from './reducers'

const logger = createLogger()

export const store = createStore(reducers,
  applyMiddleware(
    logger,
    thunkMiddleware,
    promiseMiddleware
  )
)