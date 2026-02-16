import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-indigo-600">Loading...</div>;
    }

    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;
