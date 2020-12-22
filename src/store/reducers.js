import { combineReducers } from 'redux'
import MainReducer from '../pages/MainPage/MainReducer'
import QuoteReducer from '../pages/MainPage/components/QuotePanes/QuoteReducer'
import OrderReducer from '../pages/MainPage/components/OrderPanes/OrderReducer'

const reducers = combineReducers({
  MainReducer,
  QuoteReducer,
  OrderReducer
})

export default reducers