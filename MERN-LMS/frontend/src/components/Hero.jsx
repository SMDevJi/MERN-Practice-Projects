import { motion } from 'framer-motion';
import React from 'react'
import { FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function Hero() {
    return (
        <div className="wrapper flex justify-center bg-gradient-to-br from-violet-950 via-indigo-900 to-gray-900">
            <motion.div 
            
            initial={{opacity:0,y:30}}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{duration:1}}


            className='lg:max-w-[900px] md:max-w-[700px] max-w-[500px] my-30 md:my-60 p-7 text-white '>
                <h1 className='text-center text-5xl md:text-4xl lg:text-6xl font-extrabold '>Grow Your Skills</h1>
                <p className='text-center mt-6 font-normal text-xl -tracking-tighter lg:text-2xl'>Unlock seamless online education with our all-in-one learning platform designed for schools, educators, and organizations to create, manage, and scale digital learning experiences with ease.</p>
                <div className='btn-container w-full flex justify-center mt-5'>
                    <Link to='/all-courses'>
                        <button
                            className='flex items-center p-3 gap-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium cursor-pointer'
                        >
                            <FaBookOpen size={20} />  Explore Courses
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Hero