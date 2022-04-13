import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

export const Logout = () => {

    const logout = () => {
        const options = {
            method: 'POST',
            url: 'http://localhost:5000/api/v1/user/logout',
            withCredentials: true
        }
        axios(options)
        .then(Cookies.set('loggedIn', "0"));
    }

    const [time, setTime] = useState(5);
    useEffect(() => {
        logout();
        setTimeout(() => {
            window.location = "/"
        }, 5000)
        setTimeout(() => {
            setTime(time - 1)
        }, 1000)
    }, [time])

    return (
        <div className="container logout-msg">
            <h1> Redirecting you to home page in {time} seconds</h1>
        </div>
    )
}
