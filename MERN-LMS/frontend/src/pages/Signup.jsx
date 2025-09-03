import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [isSelfTutor, setIsSelfTutor] = useState(false);
    const [registerErr, setRegisterErr] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      console.log(isSelfTutor)
    }, [isSelfTutor])
    

    const registerRequest = (nm, em, pwd, cpwd, isOauth, picture = "") => {
        console.log(nm, em, pwd, cpwd, isOauth, picture, isSelfTutor);
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
            data: {
                name: nm,
                email: em,
                password: pwd,
                confirmPassword: cpwd,
                isOauth: isOauth,
                picture: picture,
                isTutor: isSelfTutor
            }
        };

        axios.request(options).then(function (response) {
            if (!response.data.success) {
                setRegisterErr(response.data.message);
            } else {
                navigate('/login');
            }
            console.log(response.data);
        }).catch(function (error) {
            try {
                setRegisterErr(error.response.data.message);
            } catch {
                setRegisterErr(error.message);
            }
            console.error(error.message);
        });
    };

    const handleNormalSignUp = (e) => {
        e.preventDefault();
        registerRequest(
            e.target['name'].value,
            e.target['email'].value,
            e.target['password'].value,
            e.target['confirm-password'].value,
            false,
            ''
        );
    };

    const onGoogleSuccess = (creds) => {
        const credential = creds.credential;
        const decoded = jwtDecode(credential);
        console.log(decoded);
        registerRequest(decoded.name, decoded.email, "", "", true, decoded.picture);
    };

    const onGoogleError = (error) => {
        console.log(error);
        setRegisterErr(error);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Create an Account</h2>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        onError={onGoogleError}
                    />
                </div>

                <div className="my-4 flex items-center justify-between">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-sm text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <form className="space-y-4" onSubmit={handleNormalSignUp}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your password"
                            autoComplete="on"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Confirm your password"
                            autoComplete="on"
                            value={cPassword}
                            onChange={(e) => setCPassword(e.target.value)}
                        />
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registering as:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={!isSelfTutor}
                                    onChange={() => setIsSelfTutor(false)}
                                    className="form-radio text-blue-600"
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
                                    className="form-radio text-blue-600"
                                />
                                <span>Tutor</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600">
                    <span className='text-red-500'>{registerErr}</span><br />
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold hover:text-gray-800">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
