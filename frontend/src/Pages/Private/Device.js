import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Device.css'

export const Device = () => {

    const [data, setData] = useState([]);
    const [order, setOrder] = useState({name: "asc", type: "asc", _id: "asc"})

    const getDevices = () => {
        const options = {
            method: "GET",
            url: "http://localhost:5000/api/v1/user/all_devices",
            withCredentials: true
        }
        axios(options)
        .then(r => setData(r.data.data))
        .then(Promise.all(data.map(async (d) => {
            const options = {
                method: "GET",
                url: `http://localhost:5000/api/v1/device/${d._id}/latest_telemetry`,
                withCredentials: true
            }
            let r = await axios(options);
            data[d] = {...data[d], ...{latest_telemetry: r.data}};
            setData(data);
        })))
    }

    useEffect(() => {
        getDevices();
        const intervalId = setInterval(() => getDevices(), 3000);
        return () => clearInterval(intervalId)
    }, [])

    const sort = (colName) => {
        if (order[colName] === "dec") {
            const sortedData = [...data].sort((a, b) => 
                a[colName].toLowerCase() > b[colName].toLowerCase() ? 1 : -1
            );
            setData(sortedData);
            setOrder({...order, [colName]: "asc"});
        }
        if (order[colName] === "asc") {
            const sortedData = [...data].sort((a, b) => 
                a[colName].toLowerCase() < b[colName].toLowerCase() ? 1 : -1
            );
            setData(sortedData);
            setOrder({...order, [colName]: "dec"});
        }
    }

    const timestampToDate = (ts) => {
        let date = new Date(ts);
        return date.toLocaleString();
    }

    const navigate = useNavigate(); 
    const redirectToDashboard = (_id) => {
        navigate(`/dashboard?id=${_id}`);
    }

    const redirectToDeviceForm = (method, _id=undefined, name=undefined, type=undefined) => {
        navigate("/device/form", {state:{method, _id, name, type}});
    }

    const deleteDevice = (_id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:5000/api/v1/device/${_id}`,
            withCredentials: true,
        }
        axios(options)
        .then(() => window.location.reload())
    }

    return (
        <div className="container">
            <button className="btn add-btn" onClick={() => redirectToDeviceForm("POST")}>Add device</button>
            <table className="table">
                <thead>
                    <tr>
                        <th onClick={() => sort("name")}>Device Name {order.name === "asc" ? <i className="fa-solid fa-arrow-down"></i>: <i className="fa-solid fa-arrow-up"></i>}</th>
                        <th onClick={() => sort("type")}>Device Type  {order.type === "asc" ? <i className="fa-solid fa-arrow-down"></i>: <i className="fa-solid fa-arrow-up"></i>}</th>
                        <th onClick={() => sort("_id")}>ID {order._id === "asc" ? <i className="fa-solid fa-arrow-down"></i>: <i className="fa-solid fa-arrow-up"></i>}</th>
                        <th>Latest Telemetry</th>
                        <th>At Time</th>
                        <th>To Dashboard</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    { data.map((d) => (
                        <tr key={d._id}>
                            <td>{d.name}</td>
                            <td>{d.type}</td>
                            <td>{d._id}</td>
                            <td>{d.latest_telemetry === undefined ? "" : JSON.stringify(d.latest_telemetry.telemetry)}</td>
                            <td>{d.latest_telemetry === undefined ? "" : timestampToDate(d.latest_telemetry.ts)}</td>
                            <td><button className="btn table-btn" onClick={() => redirectToDashboard(d._id)}>Go</button></td>
                            <td><button className="btn edit-btn" onClick={() => redirectToDeviceForm("PUT", d._id, d.name, d.type)}>Edit</button></td>
                            <td><button className="btn delete-btn" onClick={() => deleteDevice(d._id)}>DELETE</button></td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    
    )
}
