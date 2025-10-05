import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { add, setCoins } from '../redux/userSlice';
import { toast } from 'sonner'

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [requesting, setRequesting] = useState(false)
    const [loginErr, setLoginErr] = useState('');
    const navigate = useNavigate();

    const loginRequest = (email, password) => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
            data: {
                email: email,
                password: password
            },
        };
        setRequesting(true)
        axios
            .request(options)
            .then(function (response) {
                if (!response.data.success) {
                    setLoginErr(response.data.message);
                    toast.error('Login failed!')
                }
                else {
                    localStorage.setItem('authorization', response.data.authorization);
                    dispatch(add(response.data.authorization));

                    const decoded=jwtDecode(response.data.authorization)
                    localStorage.setItem('coins', decoded.coins)
                    dispatch(setCoins(decoded.coins))

                    toast.success('Login successful!')
                    navigate('/dashboard');
                }
            })
            .catch(function (error) {
                setLoginErr(error.response?.data?.message || error.message);
                if (error.response.status == 403) {
                    toast.error("Please verify OTP first!")
                    navigate(`/verify-otp/?validity=${error.response.data.otpValidMins}&email=${email}`);
                } else {
                    toast.error('Login failed!')
                }
            }).finally(() =>
                setRequesting(false)
            );
    };



    const handleNormalLogin = (e) => {
        e.preventDefault();
        loginRequest(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>



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
                        <button type="submit" className={`w-full px-4 py-2 ${requesting ? 'bg-gray-600 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white rounded-lg `}>
                            {requesting ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600">
                    <span className='text-red-600 text-bold'>{loginErr}</span><br />
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold hover:text-gray-800">Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
