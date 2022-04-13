import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import "chartjs-adapter-moment";
import axios from 'axios';
import './Dashboard.css'
  
export const Dashboard = () => {
    ChartJS.register(
        CategoryScale,
        TimeScale,
        TimeSeriesScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
       

    const [searchParams] = useSearchParams();
    const [data, setData] = useState([[], []]);


    const getTelemetry = () => {
        const options = {
            method: "GET",
            url: `http://localhost:5000/api/v1/device/${searchParams.get("id")}/telemetry?sort=-1`,
            withCredentials: true
        }
        axios(options)
        .then(r => {
            let temp = r.data.data.map(x => ({ 'x': x.ts, 'y': x.telemetry.temp }));
            let hum = r.data.data.map(x => ({ 'x': x.ts, 'y': x.telemetry.hum }));
            setData([temp, hum]);
        })
    }

    useEffect(() => {
        getTelemetry();
        const intervalId = setInterval(() => getTelemetry(), 1000);
        return () => clearInterval(intervalId)
    }, [])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Temp and Hum',
                color: '#000000',
                font: {
                    size: 30
                }
            },
        },
        scales: {
            y: {
                grid: {
                    color: '#A7ADAF'
                },
                ticks: {
                    color: '#00000'
                }
            },
            x: {
                grid: {
                    color: '#A7ADAF'
                },
                ticks: {
                    color: '#00000'
                },
                type: 'time',
                time: {
                    unit: 'second',
                    stepSize: 30,
                },
                min: Date.now() - 3 * 60 * 1000
            }
        }
  
    };

    const dataToPlot = {
        datasets: [
            {
                label: 'Temperature',
                data: data[0],
                borderColor: '#ED1233',
                backgroundColor: '#ED1233',
                lineTension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 10
            },
            {
                label: 'Humidity',
                data: data[1],
                borderColor: '#0218FD',
                backgroundColor: '#0218FD',
                lineTension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 10
            },
        ],
    };

    const oneRandomData = () => {
        const options = {
            method: "POST",
            url: `http://localhost:5000/api/v1/device/${searchParams.get("id")}/telemetry?random=1`,
            withCredentials: true
        }
        axios(options)
    }

    const [isSendingRandom, setIsSedningRandom] = useState(false);
    let sendingRandomId;
    useEffect(() => {
        oneRandomData();
        if (isSendingRandom) {
            sendingRandomId = setInterval(oneRandomData, 5000);
        }
        return (() => clearInterval(sendingRandomId))
    }, [isSendingRandom])

    return (
        <div className="container chart-container">
            <button className="btn random-btn" onClick={() => setIsSedningRandom(true)}>Random Data</button>
            <Line options={options} data={dataToPlot}/>
        </div>
    )
}
