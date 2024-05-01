
import {Button, CardBody, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {PencilSquare, Trash, Vr} from "react-bootstrap-icons";


export default function UserList() {
    const configAuthOnly = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    }

    const [userList, setUserList] = useState([]);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [error, setError] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_USER')
    const errorDiv = error
        ?
        <Modal.Footer>
        <div className="alert alert-warning alert-dismissible mt-2" role="alert">
            {error}
        </div>
        </Modal.Footer>
        : '';

    const handleClose = () => {
        setError('')
        setUserId('')
        setUsername('')
        setPassword('')
        setRole('ROLE_USER')
        setShow(false)
    }
    const handleShow = (e) =>  {
        const userId = e.currentTarget.id
        if (userId) {
            const userObj = userList.find(user => user.id == userId);
            setUserId(userObj.id)
            setUsername(userObj.username)
            setRole(userObj.role)
            setModalTitle('Редактирование пользователя')
        } else {
            setModalTitle('Создание пользователя')
        }
        setShow(true)
    }

    const handleShowDelete = (e) => {
        setUserId(e.currentTarget.id)
        setShowDelete(true)
    }

    const handleCloseDelete = (e) => {
        setUserId('')
        setShowDelete(false)
    }

    const handleSubmitDelete = (e) => {
        configAuthOnly.params = {
            id: parseInt(userId)
        }
        axios.delete(`${process.env.REACT_APP_API_URL}admin/users` , configAuthOnly)
            .then(response => {
                console.log(response.data)
                handleClose()
                getUsers()
            })
            .catch(error => {
                setError("Ошибка сохранения!")
                console.error('Ошибка сохранения:', error.message)
            });
        setShowDelete(false)
    }

    const handleSubmitForm = (e) => {
        const userRequest = {
            username: username,
            password: password,
            role: role,
        }

        console.log(userId)

        if (userId) {
            userRequest.id = userId
            axios.put(`${process.env.REACT_APP_API_URL}admin/users`, userRequest, configAuthOnly)
                .then(response => {
                    console.log(response.data)
                    handleClose()
                    getUsers()
                })
                .catch(error => {
                    setError(error.response.data.message);
                    console.error('Ошибка сохранения:', error.message)
                });
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}auth/sign-up`, userRequest, configAuthOnly)
                .then(response => {
                    console.log(response.data)
                    handleClose()
                    getUsers()
                })
                .catch(error => {
                    setError(error.response.data.message);
                    console.error('Ошибка сохранения:', error.message)
                });
        }
        console.log(userRequest)
    }

    const getUsers = () => {
        axios.get(`${process.env.REACT_APP_API_URL}admin/users`, configAuthOnly)
            .then(response => {
                setUserList(response.data.data);
                console.log(response.data.data);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                setError(error.response.data.message);
                console.error('Error:', error);
            })


    }

    useEffect(() => {
        getUsers()
    },[setUserList]);

    return (
        <Container>
            <Col>
                <Row>
                    <Col className="ps-1">
                        <h3 className="mt-4">Список Пользователей</h3>
                    </Col>
                    <Col className="text-end pe-0">
                        <Button className="mt-4 btn-secondary" onClick={handleShow}>Создать пользователя</Button>
                    </Col>
                </Row>
                <Row>
                    <CardBody>
                        <Table>
                            <thead>
                            <tr style={{ textAlign: "center" }}>
                                <th>№</th>
                                <th>Логин</th>
                                <th>Роль</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                            {userList.map((user) => {
                                return <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td >
                                        {/*<td style={{ width: "9%" }}>*/}
                                        <Button id={user.id} onClick={handleShow} className='btn-success me-2'>
                                            <PencilSquare className='mb-1'/>
                                        </Button>
                                        <Button id={user.id} onClick={handleShowDelete} className='btn-danger'>
                                            <Trash className='mb-1'/>
                                        </Button>
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                    </CardBody>
                </Row>
            </Col>

            <Modal         show={show}
                           onHide={handleClose}
                           backdrop="static"
                           keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control value={username} className="mb-3" type="text" name="type" placeholder="Логин" onChange={e =>{ setUsername(e.target.value); setError('')}} />
                            <Form.Control value={password} className="mb-3" type="text" name="description" placeholder="Пароль" onChange={e => {setPassword(e.target.value); setError('')}}/>
                            <Form.Select value={role} name="priority" onChange={e => setRole(e.target.value)}>
                                <option value="ROLE_USER">Пользователь</option>
                                <option value="ROLE_ADMIN">Администратор</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmitForm}>
                        Сохранить
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрыть
                    </Button>


                </Modal.Footer>
                {errorDiv}
            </Modal>
            <Modal         show={showDelete}
                           onHide={handleCloseDelete}
                           backdrop="static"
                           keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены что хотите удалить пользователя?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleSubmitDelete}>
                        Подтвердить
                    </Button>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>

    );
};
