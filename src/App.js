import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';

import { BrowserRouter as Router, Route } from 'react-router-dom';


function App(props) {

  return (
    <Router>
      <Route path="/login" component={LoginPage} />
      <Route exact path="/" component={MainPage} />
    </Router>
  );
}


export default App
