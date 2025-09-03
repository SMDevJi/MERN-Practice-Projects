import React from 'react'
import { Link } from 'react-router-dom'

function About() {
    return (
        <div className='min-h-[80vh] p-10 flex justify-center'>
            <div className='flex flex-col gap-4 max-w-[1000px] text-base sm:text-lg md:text-xl leading-relaxed'>
                
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold'>About Our LMS</h1>
                <p>
                    Welcome to our Learning Management System (LMS)! We provide an innovative platform designed to deliver
                    a seamless and engaging learning experience. Whether you are a student, teacher, or institution, our LMS
                    offers the tools and resources to help you reach your educational goals.
                </p>

                <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold'>Our Mission</h2>
                <p>
                    Our mission is to empower educators and learners by providing a modern, intuitive, and scalable learning
                    environment. We aim to bridge the gap between knowledge and accessibility, helping individuals to acquire
                    skills and improve their academic performance.
                </p>

                <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold'>Why Choose Us?</h2>
                <ul className='list-disc list-inside'>
                    <li>Interactive courses with multimedia content to enhance learning.</li>
                    <li>Real-time progress tracking to monitor your performance.</li>
                    <li>Mobile-friendly platform for learning on the go.</li>
                    <li>Comprehensive reporting and analytics for educators.</li>
                </ul>

                <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold'>Join Us Today!</h2>
                <p>
                    Ready to get started? Join our LMS community today and begin your learning journey. We provide a
                    user-friendly experience to help you achieve your goals with ease.
                </p>

                <div className='mt-3'>
                    <Link  to="/signup" className='text-white p-3 rounded-md bg-black hover:bg-gray-800 '>Start Learning Now</Link>
                </div>
            </div>
        </div>
    )
}

export default About
