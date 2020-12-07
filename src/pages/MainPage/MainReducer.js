import {
  ADD_SYMBOL
} from './MainAction'

function MainReducer (state = [], action) {
  switch(action.type) {
    case ADD_SYMBOL: {
      return [
        ...state, action.payload
      ]
    }
  }
}