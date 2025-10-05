import React from 'react'
import { useNavigate } from 'react-router-dom';

function PaymentCancelled() {
    const navigate = useNavigate()
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center ">
                <h1 className="text-3xl font-semibold text-red-600 mb-4">Payment Cancelled</h1>
                <p className="text-lg text-gray-700 mb-6">
                    We're sorry, but your payment was not completed successfully.
                </p>

                <button
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                    onClick={() => navigate('/purchases')}
                >
                    Back to Purchases
                </button>
            </div>
        </div>
    );
}

export default PaymentCancelled