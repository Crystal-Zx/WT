// import './assets/style/reset.scss'
import MainPage from './pages/MainPage/MainPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

import { BrowserRouter as Router, Route } from 'react-router-dom';


function App(props) {

  return (
    <Router>
      <Route exact path="/" component={MainPage} />
      <Route path="/settings" component={SettingsPage} />
    </Router>
  );
}



export default App
