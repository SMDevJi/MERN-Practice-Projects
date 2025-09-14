import React, { useState, useEffect } from 'react'
import Loading from '../components/Loading';
import axios from 'axios';
import Course from '@/components/Course';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { isJwtExpired } from '@/utils/utilities';

function Dashboard() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false);
    const authorization = useSelector((state) => state.user.authorization);
    const navigate = useNavigate()


    let decoded = null;

    try {
        if (authorization) {
            //console.log(authorization)
            decoded = jwtDecode(authorization);
        }
    } catch (err) {
        console.error("Invalid token");
        navigate("/login")
    }

    useEffect(() => {
        if (!authorization || !decoded) {
            navigate('/login');
            return;
        }

        
        if (isJwtExpired(authorization)) {
            navigate('/login');
            return;
        }

    }, [authorization, navigate]);



    useEffect(() => {
        setLoading(true);
        const options = { method: 'GET', url: `${import.meta.env.VITE_BACKEND_URL}/api/course/view-all` };

        axios.request(options).then(function (response) {
            console.log(response.data);
            let fetchedCourses = response.data.courses;
            // let courseArray = fetchedCourses.map(course => ({
            //     id: course._id,
            //     title: course.title,
            //     tutor: course.tutor,
            //     image: course.thumbnail
            // }));

            setCourses(fetchedCourses);
        }).catch(function (error) {
            console.error(error);
            toast.error('Failed to load courses!');
        }).finally(function () {
            setLoading(false);
        });
    }, []);



    return (
        <div className='courses-wrapper min-h-[70vh]'>
            <div className="courses-section mt-10 p-4">
                <h1 className='text-xl font-semibold mb-3'>Your Courses</h1>
                <div className="courses w-full">
                    {loading ? <Loading /> :
                        courses.map(course => {
                            if (decoded && course.tutorId === decoded.id) {
                                return <Course key={course._id} product={course} authorization={authorization} onCourseChange={setCourses}/>
                            }
                            return null;
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard