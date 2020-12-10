import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { store } from './store/store'
import { Provider } from 'react-redux'

// import { setFilterType, axiosPosts } from './pages/MainPage/components/QuoteContainer/QuoteAction'

ReactDOM.render(
  <Provider store={store}>
    <App />,
  </Provider>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <Router>
//     <div>
//       <Route exact path="/" component={MainPage} />
//       <Route path="/settings" component={SettingsPage} />
//     </div>
//   </Router>,
//   document.getElementById('root')
// )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
