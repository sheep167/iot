import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Device.css';

export const AddDevice = () => {
    const [name, setName] = useState();
    const [type, setType] = useState();
    const navigate = useNavigate(); 

    const submitForm = () => {
        const options = {
            method: "POST",
            url: "http://localhost:5000/api/v1/device",
            data: {
                name: name,
                type: type
            },
            withCredentials: true,
            headers: {
                'X-CSRF-TOKEN': Cookies.get('csrf_access_token')
            }
        }
        axios(options)
        .then(() => navigate("/device"))
    }


    return (
        <div className="add-device-page">
            <div className="form">
                <form>
                <input type="hidden" name="_csrf" value={Cookies.get('csrf_access_token')}/>
                <input type="text" placeholder="Device Name" onChange={(e) => setName(e.target.value)}/>
                <input type="text" placeholder="Device Type" onChange={(e) => setType(e.target.value)}/>
                <button type="button" onClick={submitForm}>Login</button>
                </form>
            </div>
        </div>
    )
}
