import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FaSpinner } from 'react-icons/fa';
import { setCoins } from '@/redux/userSlice';

function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const prevCoins = useSelector((state) => state.user.coins);

    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(5);

    const query = new URLSearchParams(location.search);
    const courseTitle = query.get('title');
    const coursePrice = query.get('price');
    const courseCoins = query.get('coins');


    useEffect(() => {
        const newCoins=parseInt(prevCoins,10)+parseInt(courseCoins, 10)
        dispatch(setCoins(newCoins))
        localStorage.setItem('coins', newCoins)
    }, []);


    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/purchases');
                }
                return prev - 1;
            });
        }, 1000);

    }, [loading]);



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <p className="text-gray-700 mb-2"><strong>Title:</strong> {courseTitle}</p>
                <p className="text-gray-700 mb-2"><strong>Coins Bought:</strong> {courseCoins}</p>
                <p className="text-gray-700 mb-4"><strong>Price:</strong> ${coursePrice}</p>
                <p className="text-sm text-gray-500 text-center">
                    Redirecting to your purchases in <strong>{countdown}</strong> second{countdown !== 1 && 's'}...
                </p>
            </div>
        </div>
    );
}

export default PaymentSuccess;
