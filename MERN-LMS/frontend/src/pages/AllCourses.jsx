import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import CourseSection from '../components/CourseSection';
import Loading from '../components/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

function AllCourses() {
    const [search, setSearch] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);

    
    useEffect(() => {
        setLoading(true);
        const options = { method: 'GET', url: `${import.meta.env.VITE_BACKEND_URL}/api/course/view-all` };

        axios.request(options).then(function (response) {
            console.log(response.data);
            let fetchedCourses = response.data.courses;
            let courseArray = fetchedCourses.map(course => ({
                id: course._id,
                title: course.title,
                tutor: course.tutor,
                image: course.thumbnail
            }));

            setCourses(courseArray);
            setFilteredCourses(courseArray);
        }).catch(function (error) {
            console.error(error);
            toast.error('Failed to load courses!');
        }).finally(function () {
            setLoading(false);
        });
    }, []);

    
    const handleSearch = (query) => {
        setSearch(query);

        if (query === '') {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter((course) =>
                course.title.toLowerCase().includes(query.toLowerCase()) ||
                course.tutor.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    };

    return (
        <>
            <div className="header-wrapper flex justify-center bg-gradient-to-br from-violet-950 via-indigo-900 to-gray-900">
                <div className='lg:max-w-[900px] md:max-w-[700px] max-w-[500px] my-20 md:my-40 p-7 text-white '>
                    <h1 className='text-center text-3xl md:text-4xl lg:text-5xl font-extrabold '>Explore All Courses</h1>
                    <p className='text-center mt-4 font-normal text-xl -tracking-tighter lg:text-2xl'>Find the perfect course for yourself.</p>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Courses</label>
                    <input
                        type="text" id="search" name="search"
                        className="w-full mt-1 px-4 py-2 border rounded-lg bg-white text-gray-800"
                        placeholder="Search courses"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="courses-wrapper">
                {loading ? <Loading /> : <CourseSection courses={filteredCourses} isAllPage={true} />}
            </div>
        </>
    );
}

export default AllCourses;
