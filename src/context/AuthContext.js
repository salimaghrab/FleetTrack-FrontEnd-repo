// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types"; // Import de PropTypes

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Ajouter la validation des props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // children doit être un élément React
};

export function useAuth() {
  return useContext(AuthContext);
}
