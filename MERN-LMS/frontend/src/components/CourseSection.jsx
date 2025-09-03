import React from 'react'
import CourseCard from './CourseCard'

function CourseSection() {

    const courses = [
        {
            id: 1,
            title: "React js course",
            instructor: "CodeWithHarry",
            image: "/course1.jpg"
        },
        {
            id: 2,
            title: "JavaScript Essentials",
            instructor: "CodeWithHarry",
            image: "/course2.jpg"
        },
        {
            id: 3,
            title: "NextJS Mastery",
            instructor: "CodeWithHarry",
            image: "/course3.jpg"
        },
        {
            id: 4,
            title: "Shadcn full course",
            instructor: "CodeWithHarry",
            image: "/course4.jpg"
        },
        {
            id: 5,
            title: "Tailwind CSS course",
            instructor: "CodeWithHarry",
            image: "/course5.jpg"
        }
    ]
    return (
        <div className='p-5 flex flex-col w-full items-center'>
            <div className="courses-header w-full max-w-[1500px] flex justify-between">
                <h1 className='font-bold text-xl'>Our Courses</h1>
                <button className='text-base bg-white text-purple-600 hover:text-purple-400 shadow-sm shadow-purple-400 font-medium  p-2 px-4 rounded-md mx-3'>View All</button>
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