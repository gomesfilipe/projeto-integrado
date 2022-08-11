import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = (props) => {
    const token = sessionStorage.getItem('token')
    return token ? props.component: <Navigate to="/" />;
}

export default AuthGuard
