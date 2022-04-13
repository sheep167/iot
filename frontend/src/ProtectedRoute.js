import React from 'react'
import { Outlet } from 'react-router-dom'
import { Login } from './Pages/Public/Login';
import { useAuth } from "./useAuth"

export const ProtectedRoute = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Login/>
}
