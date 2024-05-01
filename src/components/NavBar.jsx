import React from "react";
import {Col, Container, Nav, Navbar, NavDropdown, OverlayTrigger, Popover, Row} from "react-bootstrap";
import {Github} from "react-bootstrap-icons";

export default function NavBar() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    console.log(isAdmin)
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('isAdmin')
        window.location.replace(`${process.env.REACT_APP_BASE_URL}`)
    }
    return(
        <Navbar expand="lg" className="navbar-dark bg-dark">
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-3">
                        <Nav.Link href="/user/incident-list">Инциденты</Nav.Link>
                        <Nav.Link href="/user/incident-log-list">Логи инцидентов</Nav.Link>
                        {isAdmin ? <Nav.Link href="/user-list">Пользователи</Nav.Link> : <div/>}
                        {isAdmin ? <Nav.Link href="/charts">Графики</Nav.Link> : <div/>}
                    </Nav>
                    <Nav className="me-3 ms-auto">
                        <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={
                            <Popover>
                                <Popover.Header as="h3">Работа выполнена:</Popover.Header>
                                <Popover.Body>
                                    <Row>
                                        <strong>Мясников Александр ПИ21-2</strong>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Row>
                                                <Col className="pe-0">
                                                    <Github/>
                                                </Col>
                                                <Col className="ps-1">
                                                    <Nav.Link href="https://github.com/aleksandrm7" target="_blank">GitHub</Nav.Link>
                                                </Col>
                                                <Col>

                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>

                                        </Col>
                                    </Row>
                                </Popover.Body>
                            </Popover>
                        }>
                            <Nav.Link>Об авторе</Nav.Link>
                        </OverlayTrigger>
                        <Nav.Link onClick={handleLogout}>Выйти</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
    );
}
