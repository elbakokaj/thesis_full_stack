import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../css/Login.css';
import axios from '../axios';
import sign from 'jwt-encode';
import jwtDecode from 'jwt-decode';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passEncode = sign(password, "marinairPopaj");
        console.log('passEncode', passEncode)
        const body = {
            email: email,
            pass: passEncode
        }
        await axios.post("api/login", body)
            .then((res) => {
                window.localStorage.setItem("token", res.data.token)
                const decodeToken = jwtDecode(res.data.token)
                if (decodeToken?.course_id) {
                    window.localStorage.setItem("course_id", decodeToken?.course_id)
                }
                window.localStorage.setItem("user_id", decodeToken?.id)
                window.localStorage.setItem('role', decodeToken?.role)
                if (decodeToken.role == "student") {
                    window.location.assign("http://localhost:3000/student");
                }
                if (decodeToken.role == "professor") {
                    window.location.assign("http://localhost:3000/professor");
                }
                if (decodeToken.role == "admin") {
                    window.location.assign("http://localhost:3000/admin");
                }

            })
            .catch(err =>
                alert("Error:" + err)
            )
    }


    const handleSubmit123 = async (e) => {
        e.preventDefault();

        // Make a request to the server to verify the user's credentials
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.role) {
            localStorage.setItem('role', data.role);
            setLoggedIn(true);
        }
    };
    const handleForgotPassword = async () => {

        axios.post("/api/forgot-password/link", { email: email })
            .then((res) => {
                alert('A password reset link has been sent to your email.');
                console.log('res', res)
            }).catch((err) => {
                console.log("Error :" + err)
                alert("Error :" + err);

            })
        alert('A password reset link has been sent to your email.');
    };

    return (
        <div className="login-wrapper">
            <div className="parent-container">
                <div className='login-form'>
                    <form className='mainForm' onSubmit={handleSubmit}>
                        <div className='login forms form-style'>


                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='input input-field' placeholder='Please enter your email here' />
                            <br />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='input input-field' placeholder='Please enter your password here' />
                            <br />
                            <button type="submit" className='input submit'>LOG IN</button>
                            <br />
                            <button type="button" className='input forgot-password' onClick={handleForgotPassword}>Forgot Password</button>

                        </div>
                    </form>
                </div >
            </div >
        </div >
    );
};

export default Login;
