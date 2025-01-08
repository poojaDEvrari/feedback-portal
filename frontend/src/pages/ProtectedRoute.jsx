import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, allowedRoles, children }) => {
    const userRole = localStorage.getItem('role'); // Get role from localStorage

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" replace />; // Redirect to login if unauthorized
    }

    return children; // Render the component if authorized
};

export default ProtectedRoute;
