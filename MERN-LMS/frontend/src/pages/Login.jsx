import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { add } from '../redux/userSlice';

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginErr, setLoginErr] = useState('');
    const [isSelfTutor, setIsSelfTutor] = useState(false);
    const navigate = useNavigate();

    const loginRequest = (email, password, isOauth, token = '') => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
            data: {
                email: email,
                password: password,
                isOauth: isOauth,
                token: token,
                isTutor: isSelfTutor,
            },
        };

        axios
            .request(options)
            .then(function (response) {
                if (!response.data.success) {
                    setLoginErr(response.data.message);
                } else {
                    localStorage.setItem('authorization', response.data.authorization);
                    dispatch(add(response.data.authorization));
                    navigate('/');
                }
            })
            .catch(function (error) {
                setLoginErr(error.response?.data?.message || error.message);
            });
    };

    const onGoogleSuccess = (creds) => {
        const credential = creds.credential;
        const decoded = jwtDecode(credential);
        loginRequest(decoded.email, '', true, credential);
    };

    const onGoogleError = (error) => {
        setLoginErr(error);
    };

    const handleNormalLogin = (e) => {
        e.preventDefault();
        loginRequest(email, password, false,'');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

                <div className="flex justify-center">
                    <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
                </div>

                <div className="my-4 flex items-center justify-between">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-sm text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <form className="space-y-4" onSubmit={handleNormalLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email" id="email" name="email"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password" id="password" name="password"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your password" autoComplete="on"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Login as</label>
                        <div className="flex space-x-4 mt-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={!isSelfTutor}
                                    onChange={() => setIsSelfTutor(false)}
                                />
                                <span>Student</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="tutor"
                                    checked={isSelfTutor}
                                    onChange={() => setIsSelfTutor(true)}
                                />
                                <span>Tutor</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Login</button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600">
                    <span className='text-red-500'>{loginErr}</span><br />
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold hover:text-gray-800">Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
