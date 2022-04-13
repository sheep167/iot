import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import './Device.css';

export const DeviceForm = () => {
    const location = useLocation();
    const [name, setName] = useState(location.state.name);
    const [type, setType] = useState(location.state.type);
    const navigate = useNavigate();

    const submitForm = () => {
        let url = "http://localhost:5000/api/v1/device";
        if (location.state._id !== undefined) {
            url = `http://localhost:5000/api/v1/device/${location.state._id}`
        }
        const options = {
            method: location.state.method,
            url: url,
            data: {
                name: name,
                type: type
            },
            withCredentials: true,
        }
        axios(options)
        .then(() => navigate("/device"))
    }

    return (
        <div className="device-page">
            <div className="form">
                <form>
                <input type="text" placeholder="Device Name" defaultValue={name} onChange={(e) => setName(e.target.value)}/>
                <input type="text" placeholder="Device Type" defaultValue={type} onChange={(e) => setType(e.target.value)}/>
                <button type="button" onClick={submitForm}>Submit</button>
                </form>
            </div>
        </div>
    )
}
