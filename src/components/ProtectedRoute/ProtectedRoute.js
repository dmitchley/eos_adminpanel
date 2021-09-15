import React from "react";
import { Route, Redirect } from "react-router-dom";
import Login from 'views/Login/Login';

const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  isVerifying,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isVerifying ? (
        <div />
      ) : isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect from="/" to="/login" />
        // <Redirect
        //   to={{
        //     pathname: "/login",
        //     state: { from: props.location }
        //   }}
        // />
      )
    }
  />
);

export default ProtectedRoute;