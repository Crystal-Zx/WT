import thunkMiddleware from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'
import reducers from './reducers'

export const store = createStore(reducers,
  applyMiddleware(
    thunkMiddleware
  )
)