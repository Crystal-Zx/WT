import './assets/style/reset.scss'
import './assets/style/variables.scss'
import MainPage from './pages/MainPage/MainPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

function App(props) {
  return (
    <Router>
      <Route exact path="/" component={MainPage} />
      <Route path="/settings" component={SettingsPage} />
    </Router>
  );
}



export default connect()(App);
