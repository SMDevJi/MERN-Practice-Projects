import React from 'react'

function Feedback() {
    return (
        <div className='flex justify-center w-full items-center min-h-[80vh] bg-gray-100'>
            <form method="post" className='w-full max-w-[400px] bg-white p-6 rounded-xl'>
                <h1 className='font-semibold mb-3 text-2xl'>Submit Feedback</h1>
                <input className='text-gray-400 p-2 border border-gray-300 rounded-md w-full' value='darksoul' disabled type="text" id="name" name="name" required /><br /><br />

                <textarea className='resize-none border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full' id="message" name="message" rows="4" placeholder="Describe your feedback..." required></textarea><br /><br />

                <button className='bg-black hover:bg-gray-800 text-white p-3 w-full rounded-md font-semibold' type="submit">Submit Feedback</button>
            </form>
        </div>
    )
}

export default Feedback
