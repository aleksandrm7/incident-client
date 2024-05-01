import {Col, Container, Row} from "react-bootstrap";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell, Legend, Line, LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {useEffect, useState} from "react";
import axios from "axios";


export default function ChartsPage() {

    const configAuthOnly = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    }

    const [statusData, setStatusData] = useState([]);
    const [priorityData, setPriorityData] = useState([]);
    const [dateRegisteredData, setDateRegisteredData] = useState([]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#585858'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const getStatusData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}admin/charts/status` , configAuthOnly)
            .then(response => {
                console.log(response.data)
                setStatusData(response.data.data)
            })
            .catch(error => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                console.error(error.message)
            });
    }

    const getPriorityData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}admin/charts/priority` , configAuthOnly)
            .then(response => {
                console.log(response.data)
                setPriorityData(response.data.data)
            })
            .catch(error => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                console.error(error.message)
            });
    }

    const getDateRegisteredData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}admin/charts/date-registered` , configAuthOnly)
            .then(response => {
                console.log(response.data)
                setDateRegisteredData(response.data.data)
            })
            .catch(error => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                console.error(error.message)
            });
    }

    useEffect(() => {
        getStatusData()
        getPriorityData()
        getDateRegisteredData()
    }, []);

    return (
        <Container>
        <ResponsiveContainer width="50%" height={200}>
            <h3 className="text-center">Инциденты по статусам</h3>
            <PieChart width={400} height={400}>
                <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                >
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip/>
            </PieChart>
            <h3 className="text-center">Инциденты по приоритету</h3>
            <PieChart width={400} height={400}>
                <Pie
                    data={priorityData}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                >
                    {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip/>
            </PieChart>
            <h3 className="text-center">Инциденты по датам</h3>
            <LineChart
                height={400}
                data={dateRegisteredData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>
        </ResponsiveContainer>
        </Container>
    );
}
