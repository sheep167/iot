import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";
import { Login, Logout, Register, Device, AddDevice, Dashboard } from "./Pages/index";
import { ProtectedRoute } from "./ProtectedRoute"
import { useAuth } from "./useAuth"

function App() {
    const isAuth = useAuth();
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={isAuth ? <Navigate to="/device"/> : <Login/>}/>
                <Route path="login" element={isAuth ? <Navigate to="/device"/> : <Login/>}/>
                <Route path="logout" element={isAuth ? <Logout/> : <Navigate to="/"/>}/>
                <Route path="register" element={<Register/>}/>
                <Route element={<ProtectedRoute/>}>
                    <Route path="device" element={<Device/>}/>
                    <Route path="device/add" element={<AddDevice/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
