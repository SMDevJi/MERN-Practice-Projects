import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { add } from '@/redux/userSlice';
import { FaSpinner } from 'react-icons/fa';

function PaymentSuccess() {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authorization = useSelector((state) => state.user.authorization);

    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(5);

    const query = new URLSearchParams(location.search);
    const courseTitle = query.get('title');
    const coursePrice = query.get('price');

    
    useEffect(() => {
        axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/reissue-token`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${authorization}`,
                },
            }
        )
        .then((res) => {
            const newToken = res.data.authorization;
            dispatch(add(newToken));
            localStorage.setItem('authorization', newToken);
        })
        .catch((err) => console.error('Token reissue failed:', err))
        .finally(() => setLoading(false));
    }, []);

    
    useEffect(() => {
        if (loading) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/profile');
                }
                return prev - 1;
            });
        }, 1000);

    }, [loading]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-2xl" />
                <p className="mt-4 text-gray-600 text-lg">Processing your payment, please wait...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <p className="text-gray-700 mb-2"><strong>Course ID:</strong> {courseId}</p>
                <p className="text-gray-700 mb-2"><strong>Title:</strong> {courseTitle}</p>
                <p className="text-gray-700 mb-4"><strong>Price:</strong> ${coursePrice}</p>
                <p className="text-sm text-gray-500 text-center">
                    Redirecting to your profile in <strong>{countdown}</strong> second{countdown !== 1 && 's'}...
                </p>
            </div>
        </div>
    );
}

export default PaymentSuccess;
