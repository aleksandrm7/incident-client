
import {Alert, Button, CardBody, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {PencilSquare, Trash, Vr} from "react-bootstrap-icons";
import {BiSortAlt2, BiSortDown, BiSortUp} from "react-icons/bi";
import {useSortBy, useTable} from "react-table";
import './IncidentList.css'


export default function IncidentList() {

    const renderUserFilter = () => {
        if (isAdmin) {
            return  <Col>
                <Form.Select value={userIdFilter} name="userIdFilter" onChange={e => setUserIdFilter(e.target.value)}>
                    <option defaultValue value="">Все</option>
                    {userList.map((user) => {
                        return <option value={user.id}>{user.username}</option>
                    })}
                </Form.Select>
            </Col>
        }
        return null
    }
    const configAuthOnly = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    }
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            userId: localStorage.getItem('userId'),
        }
    };

    const [isAdmin, setIsAdmin] = useState(false)
    const [incidentList, setIncidentList] = useState([]);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAlert, setShowAlert] = useState(false)
    const [error, setError] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [userList, setUserList] = useState([])

    const [id, setId] = useState('')
    const [type, setType] = useState('');
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('Назначена')
    const [priority, setPriority] = useState('Низкий')

    const [userIdFilter, setUserIdFilter] = useState(localStorage.getItem('userId'))
    const [typeFilter, setTypeFilter] = useState('')
    const [descriptionFilter, setDescriptionFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('')
    const [dateRegisteredFromFilter, setDateRegisteredFromFilter] = useState('')
    const [dateRegisteredToFilter, setDateRegisteredToFilter] = useState('')
    const [dateResolvedFromFilter, setDateResolvedFromFilter] = useState('')
    const [dateResolvedToFilter, setDateResolvedToFilter] = useState('')

    const handleClose = () => {
        setId('')
        setType('')
        setDescription('')
        setStatus('Назначена')
        setPriority('Низкий')
        setShow(false)
    }
    const handleShow = (e) =>  {
        const incidentId = e.currentTarget.id
        if (incidentId) {
            const incidentObj = incidentList.find(incident => incident.id == incidentId);
            setId(incidentObj.id)
            setType(incidentObj.type)
            setDescription(incidentObj.description)
            setStatus(incidentObj.status)
            setPriority(incidentObj.priority)
            setModalTitle('Редактирование инцидента')
        } else {
            setModalTitle('Создание инцидента')
        }
        setShow(true)
    }

    const handleShowDelete = (e) => {
        setId(e.currentTarget.id)
        setShowDelete(true)
    }

    const handleCloseDelete = (e) => {
        setId('')
        setShowDelete(false)
    }

    const handleSubmitDelete = (e) => {
        configAuthOnly.params = {
            id: parseInt(id)
        }
        axios.delete(`${process.env.REACT_APP_API_URL}incidents` , configAuthOnly)
            .then(response => {
                console.log(response.data)
                handleClose()
                getIncidents()
            })
            .catch(error => {
                setError("Ошибка сохранения!")
                setShowAlert(true)
                console.error('Ошибка сохранения:', error.message)
            });
        setShowDelete(false)
    }

    const handleSubmitForm = (e) => {
        const incidentRequest = {
            type: type,
            description: description,
            status: status,
            priority: priority
        }
        if (id) {
            incidentRequest.id = id
            axios.put(`${process.env.REACT_APP_API_URL}incidents`, incidentRequest, config)
                .then(response => {
                    console.log(response.data)
                    handleClose()
                    getIncidents()
                })
                .catch(error => {
                    setError("Ошибка сохранения!")
                    setShowAlert(true)
                    console.error('Ошибка сохранения:', error.message)
                });
        } else {
            incidentRequest.userId = localStorage.getItem('userId')
            axios.post(`${process.env.REACT_APP_API_URL}incidents`, incidentRequest, config)
                .then(response => {
                    console.log(response.data)
                    handleClose()
                    getIncidents()
                })
                .catch(error => {
                    setError("Ошибка сохранения!")
                    setShowAlert(true)
                    console.error('Ошибка сохранения:', error.message)
                });
        }
    }

    const handleFilters = (e) => {
        getIncidents()
    }

    const handleResetFilters = (e) => {
        if (isAdmin) {
            setUserIdFilter(localStorage.getItem('userId'))
        }
        setTypeFilter('')
        setDescriptionFilter('')
        setStatusFilter('')
        setPriorityFilter('')
        setDateRegisteredFromFilter('')
        setDateRegisteredToFilter('')
        setDateResolvedFromFilter('')
        setDateResolvedToFilter('')
        axios.get(`${process.env.REACT_APP_API_URL}incidents`, config)
            .then(response => {
                setIncidentList(response.data.data);
                console.log(response.data.data);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                setError(error)
                setShowAlert(true)
                console.error('Error:', error);
            })

    }

    const getUsers = () => {
        axios.get(`${process.env.REACT_APP_API_URL}admin/users`, configAuthOnly)
            .then(response => {
                setUserList(response.data.data);
                console.log(response.data.data);
                console.log('users')
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                setError(error)
                setShowAlert(true)
                console.error('Error:', error);
            })
    }

    const getIncidents = () => {
        const incidentFilterRequest = {
            userId: userIdFilter,
            type: typeFilter,
            description: descriptionFilter,
            status: statusFilter,
            priority: priorityFilter,
            dateRegisteredFrom: dateRegisteredFromFilter,
            dateRegisteredTo: dateRegisteredToFilter,
            dateResolvedFrom: dateResolvedFromFilter,
            dateResolvedTo: dateResolvedToFilter
        }

        console.log(incidentFilterRequest)

        axios.post(`${process.env.REACT_APP_API_URL}incidents/filter`, incidentFilterRequest, configAuthOnly)
            .then(response => {
                setIncidentList(response.data.data);
                console.log(response.data.data);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
                }
                setError(error)
                setShowAlert(true)
                console.error('Error:', error);
            })
    }

    useEffect(() => {
        setIsAdmin(localStorage.getItem('isAdmin') === 'true')
        if (localStorage.getItem('isAdmin') === 'true') {
            getUsers()
        }
    },[setUserList], );

    useEffect(() => {
        getIncidents()
    },[setIncidentList], );

    function SortableTable({columns, data}) {
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow
        } = useTable({ columns, data}, useSortBy)

        return (
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map((hG) => (
                    <tr {...hG.getHeaderGroupProps()}>
                        {hG.headers.map((col) => (
                            <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                                {col.render('Header')}{' '}
                                {/* если колонка является сортируемой, рендерим рядом с заголовком соответствующую иконку в зависимости от того, включена ли сортировка, а также на основе порядка сортировки */}
                                {col.canSort && (
                                    <span>
                        {col.isSorted ? (
                            col.isSortedDesc ? (
                                <BiSortUp/>
                            ) : (
                                <BiSortDown/>
                            )
                        ) : (
                            <BiSortAlt2/>
                        )}
                      </span>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row)

                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const data =  incidentList

    const columns =
        [
            {
                Header: '№',
                accessor: 'id',
                class: 'example'
            },
            {
                Header: 'Тип',
                accessor: 'type',
                sortType: 'string'
            },
            {
                Header: 'Описание',
                accessor: 'description',
                sortType: 'string'
            },
            {
                Header: 'Статус',
                accessor: 'status',
                sortType: 'string'
            },
            {
                Header: 'Приоритет',
                accessor: 'priority',
                sortType: 'string'
            },
            {
                Header: 'Зарегистрирован',
                accessor: 'dateRegistered',
                sortType: 'string'
            },
            {
                Header: 'Решен',
                accessor: 'dateResolved'
            },
            {
                Header: 'Ответственный',
                accessor: ({userResponsible}) => `${userResponsible.username}`,
                sortType: 'string'
            },

            {
                Header: "Действия",
                Cell: ({ cell }) => (
                    <div>
                        <Button id={cell.row.values.id} onClick={handleShow} className='btn-success me-2'>
                            <PencilSquare className='mb-1'/>
                        </Button>
                        <Button id={cell.row.values.id} onClick={handleShowDelete} className='btn-danger'>
                            <Trash className='mb-1'/>
                        </Button>
                    </div>
                )
            }

        ]



    return (
        <Container>
            <Col>
                <Row>
                    <Col className="ps-1">
                        <h3 className="mt-4">Список инцидентов</h3>
                    </Col>
                    <Col className="text-end pe-0">
                        <Button className="mt-4 btn-warning" onClick={handleShow}>Создать инцидент</Button>
                    </Col>
                </Row>

                <Row className="mt-2">
                    <Form>
                        <Form.Group>
                            <Row>
                                <Col className="ms-0">
                                    <Form.Control value={typeFilter} type="text" name="typeFilter" placeholder="Тип"
                                                  onChange={e => setTypeFilter(e.target.value)}/>
                                </Col>
                                <Col>
                                    <Form.Control value={descriptionFilter}  type="text" name="descriptionFilter" placeholder="Описание содержит" onChange={e => setDescriptionFilter(e.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Select value={statusFilter} className="mb-2" name="statusFilter" onChange={e => setStatusFilter(e.target.value)}>
                                        <option defaultValue value=""></option>
                                        <option value="Назначена">Назначена</option>
                                        <option value="В работе">В работе</option>
                                        <option value="На паузе">На паузе</option>
                                        <option value="Выполнена">Выполнена</option>
                                        <option value="Закрыта">Закрыта</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Select value={priorityFilter} name="priorityFilter" onChange={e => setPriorityFilter(e.target.value)}>
                                        <option defaultValue value=""></option>
                                        <option value="Низкий">Низкий</option>
                                        <option value="Средний">Средний</option>
                                        <option value="Высокий">Высокий</option>
                                        <option value="Критический">Критический</option>
                                    </Form.Select>
                                </Col>
                                {renderUserFilter()}
                            </Row>
                            <Row className="mt-1 mb-2">
                                <Col>
                                    <Form.Control value={dateRegisteredFromFilter} type="date" name="dateRegisteredFromFilter" onChange={e => setDateRegisteredFromFilter(e.target.value)} />
                                    <Form.Text className="text-muted text-center">Зарегистрирован от и до</Form.Text>
                                </Col>
                                <Col>
                                    <Form.Control value={dateRegisteredToFilter} type="date" name="dateRegisteredToFilter" onChange={e => setDateRegisteredToFilter(e.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Control value={dateResolvedFromFilter} type="date" name="dateResolvedFromFilter" onChange={e => setDateResolvedFromFilter(e.target.value)}/>
                                    <Form.Text className="text-muted text-center">Решен от и до</Form.Text>
                                </Col>
                                <Col>
                                    <Form.Control value={dateResolvedToFilter} type="date" name="dateResolvedToFilter" onChange={e => setDateResolvedToFilter(e.target.value)} />
                                </Col>
                                <Col>
                                    <Button className="w-100" onClick={handleFilters}>Применить фильтр</Button>
                                </Col>
                                <Col>
                                    <Button className="w-100 btn-secondary" onClick={handleResetFilters}>Сбросить</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Row>
                <Row>
                    <CardBody>
                        <SortableTable columns={columns} data={data}/>
                    </CardBody>
                </Row>
            </Col>

            <Modal show={show}
                   onHide={handleClose}
                   backdrop="static"
                   keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control value={type} className="mb-3" type="text" name="type" placeholder="Тип"
                                          onChange={e => setType(e.target.value)}/>
                            <Form.Control value={description} className="mb-3" type="text" name="description"
                                          placeholder="Описание" onChange={e => setDescription(e.target.value)}/>
                            <Form.Label className="ms-1 text-success">Статус и приоритет</Form.Label>
                            <Form.Select value={status} className="mb-3" name="status"
                                         onChange={e => setStatus(e.target.value)}>
                                <option value="Назначена">Назначена</option>
                                <option value="В работе">В работе</option>
                                <option value="На паузе">На паузе</option>
                                <option value="Выполнена">Выполнена</option>
                                <option value="Закрыта">Закрыта</option>
                            </Form.Select>
                            <Form.Select value={priority} name="priority" onChange={e => setPriority(e.target.value)}>
                                <option value="Низкий">Низкий</option>
                                <option value="Средний">Средний</option>
                                <option value="Высокий">Высокий</option>
                                <option value="Критический">Критический</option>
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
            </Modal>
            <Modal         show={showDelete}
                           onHide={handleCloseDelete}
                           backdrop="static"
                           keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены что хотите удалить инцидент?
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
            <Modal         show={showAlert}
                           onHide={() => setShowAlert(false)}
                           backdrop="static"
                           keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Ошибка</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlert(false)}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>

    );
};