import React, { useState, useEffect } from 'react'
import CourseCard from './CourseCard'
import Loading from './Loading'

import { Link } from 'react-router-dom';


function CourseSection({ courses, isAllPage }) {

    return (
        <div className='p-5 flex flex-col w-full items-center'>
            <div className="courses-header w-full max-w-[1500px] flex justify-between">
                <h1 className='font-bold text-xl'>Our Courses</h1>
                {isAllPage ?
                    <>
                    </>
                    :
                    <Link to='/all-courses'>
                        <button className='cursor-pointer text-base bg-white text-purple-600 hover:text-purple-400 shadow-sm shadow-purple-400 font-medium  p-2 px-4 rounded-md mx-3'>
                            View All
                        </button>
                    </Link>
                }

            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1500px] p-5'>
                {courses.map(course =>
                    <CourseCard key={course.id} product={course} />
                )}
            </div>
        </div>
    )
}

export default CourseSection