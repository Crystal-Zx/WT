import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';

import { HashRouter as Router, Route } from 'react-router-dom';


function App(props) {

  return (
    <Router>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route exact path="/index" component={MainPage} />
    </Router>
  );
}


export default App
