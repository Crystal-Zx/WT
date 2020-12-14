import { combineReducers } from 'redux'
import MainReducer from '../pages/MainPage/MainReducer'
import QuoteReducer from '../pages/MainPage/components/QuotePanes/QuoteReducer'

const reducers = combineReducers({
  MainReducer,
  QuoteReducer
})

export default reducers