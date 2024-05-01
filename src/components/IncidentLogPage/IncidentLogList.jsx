
import {Button, CardBody, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";


export default function IncidentList() {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            userId: localStorage.getItem('userId'),
        }
    };

    const [incidentLogList, setIncidentLogList] = useState([]);
    const [error, setError] = useState('');

    const getIncidentLogs = () => {
        axios.get(`${process.env.REACT_APP_API_URL}incidents/logs`, config)
            .then(response => {
                setIncidentLogList(response.data.data);
                console.log(response.data.data);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                setError(error)
                console.error('Error:', error);
            })
    }

    useEffect(() => {
        getIncidentLogs()
    },[setIncidentLogList]);

    return (
        <Container>
            <Col>
                <Row>
                    <Col className="ps-1">
                        <h3 className="mt-4">Логи инцидентов</h3>
                    </Col>
                </Row>
                <Row>
                    <CardBody>
                        <Table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Инцидент</th>
                                <th>Дата изменения</th>
                                <th>Описание изменения</th>
                            </tr>
                            </thead>
                            <tbody>
                            {incidentLogList.map((incidentLog) => {
                                return <tr key={incidentLog.id}>
                                    <td>{incidentLog.id}</td>
                                    <td>{incidentLog.incident.id}</td>
                                    <td>{incidentLog.dateUpdated}</td>
                                    <td>{incidentLog.updateDescription}</td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                    </CardBody>
                </Row>
            </Col>
        </Container>

    );
};
