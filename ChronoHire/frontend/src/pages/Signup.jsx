import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'sonner'

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [registerErr, setRegisterErr] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();



    const registerRequest = (nm, em, pwd) => {
        console.log(nm, em, pwd);
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
            data: {
                name: nm,
                email: em,
                password: pwd
            }
        };
        setLoading(true)
        axios.request(options).then(function (response) {
            if (!response.data.success) {
                setRegisterErr(response.data.message);
                toast.error('Registration failed!')
            } else {
                toast.success('Registration successful!')
                navigate(`/verify-otp/?validity=${response.data.otpValidMins}&email=${email}`);
            }
            console.log(response.data);
        }).catch(function (error) {
            try {
                setRegisterErr(error.response.data.message);
                toast.error('Registration failed!')
            } catch {
                setRegisterErr(error.message);
                toast.error('Registration failed!')
            }
            console.error(error.message);
        }.finally(() =>
            setLoading(false)
        ));
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (password != cPassword) {
            setRegisterErr("Confirm password does not match!")
            return
        }
        if(!name || !email || !password || !cPassword){
            setRegisterErr("Please fill all the details!")
            return
        }
        registerRequest(
            name,
            email,
            password
        );
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Create an Account</h2>


                <form className="space-y-4" onSubmit={handleSignUp}>
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
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 8) {
                                    setPassword(e.target.value)
                                }
                            }
                            }
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
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 8) {
                                    setCPassword(e.target.value)
                                }
                            }}
                        />
                    </div>




                    <div>
                        <button
                            className={`w-full px-4 py-2 ${loading ? 'bg-gray-600 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'}  text-white rounded-lg  focus:outline-none`}
                        >
                            {loading?'Signing up...':'Sign up'}
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
