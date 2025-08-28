import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log('Checking token:', token);

  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
