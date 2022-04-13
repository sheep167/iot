import React from 'react'
import { NavLink } from "react-router-dom";

export const PublicNavbar = () => {
    return (
        <nav className="navbar-items">
            <div className="navbar-left">
                <h1 className="navbar-logo">
                    <a href="/" className="logo-header">
                        IOT Dashboard <i className="fa-solid fa-house-signal"></i>
                    </a>
                </h1>
            </div>
            <div className="navbar-right">
                <NavLink className="btn" to="/login">Log in</NavLink>
            </div>
        </nav>
    )
}
