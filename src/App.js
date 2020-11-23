import './assets/style/variables.scss'
import MainPage from './pages/MainPage/MainPage';
import SettingsPage from './pages/SettingsPage/SettingsPage'

import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={MainPage} />
          <Route path="/settings" component={SettingsPage} />
        </div>
      </Router>
    </div>
  );
}


export default App;
