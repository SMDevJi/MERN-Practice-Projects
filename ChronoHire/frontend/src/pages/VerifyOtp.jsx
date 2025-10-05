import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { add, setCoins } from '../redux/userSlice';
import { toast } from 'sonner'


const VerifyOtp = () => {
    const dispatch = useDispatch();
    const [loginErr, setLoginErr] = useState('');
    const [otp, setOtp] = useState(0)
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [requesting, setRequesting] = useState(false)
    const [resending, setResending] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const validity = queryParams.get('validity');
    const email = queryParams.get('email');

    useEffect(() => {
        setMinutes(validity)
    }, [])


    useEffect(() => {
        const countdown = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prev => prev - 1);
            } else {
                if (minutes === 0) {
                    clearInterval(countdown);
                } else {
                    setMinutes(prev => prev - 1);
                    setSeconds(59);
                }
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [minutes, seconds]);

    const formatTime = (value) => value.toString().padStart(2, '0');


    const verifyRequest = (otp) => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`,
            data: {
                email: email,
                otp
            },
        };
        setRequesting(true)
        axios
            .request(options)
            .then(function (response) {
                if (!response.data.success) {
                    setLoginErr(response.data.message);
                    toast.error('Login failed!')
                } else {
                    localStorage.setItem('authorization', response.data.authorization);
                    dispatch(add(response.data.authorization));

                    const decoded = jwtDecode(response.data.authorization)
                    localStorage.setItem('coins', decoded.coins)
                    dispatch(setCoins(decoded.coins))

                    toast.success('Account verified successfully!')
                    toast.success('Logged in successfully!')
                    navigate('/dashboard');
                }
            })
            .catch(function (error) {
                setLoginErr(error.response?.data?.message || error.message);
                toast.error('Login failed!')
            }).finally(() =>
                setRequesting(false)
            );
    };


    const resendOtp = () => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-otp`,
            data: { email: email }
        };

        if (minutes != 0 || seconds != 0) {
            return
        }
        setResending(true)
        axios.request(options).then(function (response) {
            if (!response.data.success) {
                setLoginErr(response.data.message);
                toast.error('Failed to resend OTP!')
            } else {
                toast.success('OTP resent successfully!')
                setMinutes(response.data.otpValidMins)
                setSeconds(0)
            }
        }).catch(function (error) {
            setLoginErr(error.response?.data?.message || error.message);
            toast.error('Failed to resend OTP!')
        }).finally(() =>
            setResending(false)
        );
    }


    const handleVerify = (e) => {
        e.preventDefault();
        verifyRequest(otp);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Verify Account</h2>



                <form className="space-y-6" onSubmit={handleVerify}>
                    <div >
                        <label htmlFor="otp" className="mb-4 block  font-medium text-gray-700">Enter OTP sent to: <span className='text-blue-600 ml-1'>{email}</span></label>
                        <input
                            type="number" id="otp" name="otp"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter verification code"
                            value={otp}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 6 && val.length >= 0) {
                                    setOtp(e.target.value)
                                }
                            }
                            }
                        />
                    </div>



                    <div>
                        <button type="submit" className={`w-full px-4 py-2 ${requesting ? 'bg-gray-600 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white rounded-lg `}>
                            {requesting ? 'Verifying otp...' : 'Verify'}
                        </button>
                    </div>
                </form>
                {loginErr &&
                    <span className='text-red-600 text-bold'>{loginErr}</span>
                }
                <div className="flex w-full justify-between text-center text-sm text-gray-600">

                    Resend OTP in: {formatTime(minutes)}:{formatTime(seconds)}
                    <span onClick={resendOtp} className={`font-semibold  ${resending ? 'text-gray-400 hover:text-gray-400' : 'hover:text-gray-800'} ml-2 cursor-pointer`}>
                        {resending ? 'Resending code...' : 'Resend code'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
