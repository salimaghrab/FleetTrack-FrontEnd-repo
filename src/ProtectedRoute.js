// src/components/ProtectedRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming your AuthContext is here

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();  // Get authentication state from context

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />  // If authenticated, render the requested component
        ) : (
          <Redirect to="/authentication/sign-in" />  // If not authenticated, redirect to sign-in
        )
      }
    />
  );
};

export default ProtectedRoute;
