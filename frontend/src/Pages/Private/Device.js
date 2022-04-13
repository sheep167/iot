import React, { useEffect, useState } from 'react';
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

    const redirectToDashboard = (_id) => {;
        window.location = `/dashboard?id=${_id}`
    }

    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th onClick={() => sort("name")}>Device Name {order.name === "asc" ? <i className="fa-solid fa-arrow-down"></i>: <i className="fa-solid fa-arrow-up"></i>}</th>
                        <th onClick={() => sort("type")}>Device Type  {order.type === "asc" ? <i className="fa-solid fa-arrow-down"></i>: <i className="fa-solid fa-arrow-up"></i>}</th>
                        <th onClick={() => sort("_id")}>ID {order._id === "asc" ? <i className="fa-solid fa-arrow-down"></i>: <i className="fa-solid fa-arrow-up"></i>}</th>
                        <th>Latest Telemetry</th>
                        <th>At Time</th>
                        <th>To Dashboard</th>
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
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    
    )
}
