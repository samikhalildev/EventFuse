import React from 'react';

import '../style.css';
import 'materialize-css/dist/css/materialize.min.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';

// JWT Token
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

// Actions
import { logoutUser, setCurrentUser } from '../actions/authActions';

import Header from './Layout/Header';
import Login from './Account/Login';
import Register from './Account/Register';
import Landing from './Landing';
import Dashboard from './Dashboard';
import PrivateRoute from './Layout/PrivateRoute';

// check for token
if (localStorage.jwtToken) {
  // Set account token header
  setAuthToken(localStorage.jwtToken);

  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);

  // Set user and isAuthenticate
  store.dispatch(setCurrentUser(decoded));
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        {/* <Route path='/' component={Dashboard} /> */}
        <Route exact path='/login' component={Login} />
        <Route exact path='/login/:email' component={Login} />
        <Route path='/register' component={Register} />
        <PrivateRoute path='/dashboard' component={Dashboard} />
      </Router>
    </Provider>
  );
}

export default App;
