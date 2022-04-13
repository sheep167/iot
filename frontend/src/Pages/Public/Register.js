import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'

export const Register = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const submitForm = () => {
        const options = {
            method: 'POST',
            url: 'http://localhost:5000/api/v1/user/register',
            data: {
                username: username,
                password: password
            },
            withCredentials: true
        }
        axios(options)
        .then(() => window.location = "/login")
        .catch(() => document.getElementsByClassName("warning")[0].style.display = "block")
    }

    return (
        <div className="login-page">
            <div className="form">
                <form className="register-form">
                <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                <span className="warning">Username already exists!</span>
                <button type="button" onClick={submitForm}>Register</button>
                <p className="message">Already registered? <a href="/login">Log In</a></p>
                </form>
            </div>
        </div>
    )
}
