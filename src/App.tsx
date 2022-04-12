import Home from './pages/Home'
import NewRoom from './pages/NewRoom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import {AuthContextProvider} from './contexts/AuthContext'


function App() {

 

  return (
    <Router>
      <AuthContextProvider>
      <Route component = {Home} exact path="/"/>
      <Route component = {NewRoom} path="/rooms/new" />
      </AuthContextProvider>
    </Router>
  );
}

export default App;
