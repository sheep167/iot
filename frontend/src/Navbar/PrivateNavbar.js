import React from 'react'
import { NavLink } from "react-router-dom";

export const PrivateNavbar = () => {
    return (
        <nav className="navbar-items">
            <div className="navbar-left">
                <h1 className="navbar-logo">
                    <a href="/" className="logo-header">
                        IOT Dashboard <i className="fa-solid fa-house-signal"></i>
                    </a>
                </h1>
                <NavLink to="/device" className={"device-tab"}>Device</NavLink> 
            </div>
            <div className="navbar-right">
                <NavLink className="btn" to="/logout">Logout</NavLink> 
            </div>
        </nav>
    )
}
