import Home from './pages/Home'
import NewRoom from './pages/NewRoom'
import Room from './pages/Room'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import {AuthContextProvider} from './contexts/AuthContext'
import AdminRoom from './pages/AdminRoom'


function App() {

 

  return (
    <Router>
      <AuthContextProvider>
        <Switch>
          <Route component = {Home} exact path="/"/>
          <Route component = {NewRoom} exact path="/rooms/new" />
          <Route component = {Room} path="/rooms/:id" />
          <Route component = {AdminRoom} path="/admin/rooms/:id" />

        </Switch>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
