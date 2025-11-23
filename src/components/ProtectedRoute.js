// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let userRole = '';

  if (token) {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3 || !tokenParts[0] || !tokenParts[1] || !tokenParts[2]) {
        throw new Error('Invalid token format');
      }
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  }

  if (!token || !userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;