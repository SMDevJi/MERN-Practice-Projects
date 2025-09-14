import Error from '@/components/Error';
import { isJwtExpired } from '@/utils/utilities';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


function Feedback() {
    const authorization = useSelector((state) => state.user.authorization);
    const [decoded, setDecoded] = useState('')
    const [feedback, setFeedback] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(false)

    const submitFeedback = () => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/feedback/submit-feedback`,
            headers: {
                Authorization: `Bearer ${authorization}`
            },
            data: { comment: feedback }
        };
        setSubmitting(true)
        axios.request(options).then(function (response) {
            console.log(response.data);
            toast.success('Feedback submitted successfully!')
        }).catch(function (error) {
            console.error(error);
            toast.error('Failed to submit feedback!')
        }).finally(() =>
            setSubmitting(false)
        );
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        submitFeedback()
    }

    useEffect(() => {
        if (!authorization || isJwtExpired(authorization)) {
            setError(true);
            return;
        }
        setDecoded(jwtDecode(authorization))
    }, [authorization]);


    if (error) {
        return <div className='flex justify-center w-full items-center min-h-[80vh] bg-gray-100'>
            <Error text='Please login to submit feedback!' />
        </div>
    }
    return (
        <div className='flex justify-center w-full items-center min-h-[80vh] bg-gray-100'>
            <form method="post" className='w-full max-w-[400px] bg-white p-6 rounded-xl' onSubmit={handleSubmit}>
                <h1 className='font-semibold mb-3 text-2xl'>Submit Feedback</h1>
                <input className='text-gray-400 p-2 border border-gray-300 rounded-md w-full' value={decoded.name} disabled type="text" id="name" name="name" required /><br /><br />

                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className='resize-none border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full' id="message" name="message" rows="4" placeholder="Describe your feedback..." required></textarea><br /><br />

                <button className={`${submitting ? 'bg-gray-600 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'}  cursor-pointer text-white p-3 w-full rounded-md font-semibold`} type="submit">
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    )
}

export default Feedback
