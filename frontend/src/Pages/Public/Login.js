import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

export const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const submitForm = () => {
        const options = {
            method: "POST",
            url: "http://localhost:5000/api/v1/user/login",
            data: {
                username: username,
                password: password
            },
            withCredentials: true
        }
        axios(options)
        .then(() => window.location = "/device")
        .catch(() => document.getElementsByClassName("warning")[0].style.display = "block")
    }

    return (
        <div className="login-page">
            <div className="form">
                <form className="login-form">
                <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                <span className="warning">Wrong Combination!</span>
                <button type="button" onClick={submitForm}>Login</button>
                <p className="message">Not registered? <a href="/register" className="message">Create an account</a></p>
                </form>
            </div>
        </div>
    )
  }
  