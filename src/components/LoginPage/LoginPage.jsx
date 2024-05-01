import React, {useEffect, useState} from "react";
import './LoginPage.css'
import NavBar from "../NavBar.jsx";
import axios from "axios";



export default function Login() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        localStorage.setItem('userId', '');
        localStorage.setItem('token', '');
    }, []);
    const [error, setError] = useState('');

    const errorDiv = error
        ?
        <div className="alert alert-warning alert-dismissible mt-2" role="alert">
            {error}
        </div>
        : '';

    const handleChange = (e) => {
        setError('')
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        axios.post(`${process.env.REACT_APP_API_URL}auth/sign-in`, formData)
            .then(response => {
                const user = response.data
                localStorage.setItem('userId', user['id']);
                localStorage.setItem('token', user['token']);
                localStorage.setItem('isAdmin', user['isAdmin']);
                window.location.replace(`${process.env.REACT_APP_BASE_URL}user/incident-list`);
            })
            .catch(error => {
                console.log(error);
                setError(error.response.data.message)
                console.error('Ошибка авторизации:', error.message);
            });
    };


    const handleRegistration = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}auth/sign-up`, formData)
            .then(response => {
                const user = response.data
                localStorage.setItem('userId', user['id']);
                localStorage.setItem('token', user['token']);
                console.log(response.data['token'])
                window.location.replace(`${process.env.REACT_APP_BASE_URL}user/incident-list`);
            })
            .catch(error => {
                console.log(error);
                setError(error.response.data.message);
                console.error('Ошибка регистрации:', error.message);
            });
    };

    return (

        <div className="container">
            <div className="card container_login">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Логин</label>
                            <input type="text" className="form-control" name="username" id="username"
                                   onChange={handleChange} value={formData.username}/>
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="password">Пароль</label>
                            <input type="password" className="form-control" name="password" id="password"
                                   onChange={handleChange} value={formData.password}/>
                        </div>
                        <button type="submit" className="btn btn-primary h-75 mt-3">Войти</button>
                        <button onClick={handleRegistration} type="submit"
                                className="btn btn-primary h-75 mt-3 mx-2">Регистрация
                        </button>
                    </form>
                    {errorDiv}
                </div>
            </div>

        </div>
    );
};
