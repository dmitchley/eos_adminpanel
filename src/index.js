/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from 'components/ProtectedRoute/ProtectedRoute';
// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Add from './views/Add/add'
import Edit from "./views/Edit/Edit";
import Login from './views/Login/Login'
import "assets/css/material-dashboard-react.css?v=1.9.0";
import { Provider, connect } from 'react-redux'
import { createStore, compose } from 'redux';
import combineReducers from 'reduxStore/Reducer/CombinerReducer';
import configureStore from 'reduxStore/configureStore';
import * as serviceWorker from './serviceWorker';

const hist = createBrowserHistory();
// const store = compose(
//   window.devToolsExtension ? window.devToolsExtension() : (f) => f
// )(createStore)(combineReducers);

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/login" exact><Login /></Route>
      <Route path="/rtl" component={RTL} />
      {/* <Redirect from="/" to="/admin/dashboard" /> */}
      <Redirect from="/" to="/admin/parents" />
    </Switch>
  </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();