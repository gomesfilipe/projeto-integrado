import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = (props) => {
    const token = sessionStorage.getItem('token')
    return token ? props.component: <Navigate to="/" />;
    // return token ? <Outlet /> : <Navigate to="/" />;
}

export default AuthGuard
