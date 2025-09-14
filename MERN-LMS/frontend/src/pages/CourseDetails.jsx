import Loading from '@/components/Loading';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FaUser } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { FaBook } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
import { GiRocket } from 'react-icons/gi';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';



function CourseDetails() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [buying, setBuying] = useState(false)
    const [decoded, setDecoded] = useState(null)
    const [course, setCourse] = useState({})
    const [bought, setBought] = useState(false)
    const authorization = useSelector((state) => state.user.authorization);

    const backgroundStyle = {
        backgroundImage: `url('${course.thumbnail}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    console.log(courseId)
    useEffect(() => {
        let decoded;
        try {
            //console.log(authorization)
            decoded = jwtDecode(authorization);
            if (decoded) {
                setDecoded(decoded);
                if (decoded.enrolledCourses.includes(courseId)) {
                    setBought(true)
                } else {
                    setBought(false)
                }
            }
        } catch (err) {
            console.log(err)
            console.error("Invalid token");
            return;
        } finally {
            console.log('reached before lc')
            loadCourse();
        }


    }, [authorization, navigate, courseId]);


    const loadCourse = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/course/get-course`, {
                params: { courseId }
            });

            if (response.data.success) {
                const courseData = response.data.courses[0];

                setCourse(courseData);
                //console.log(courseData)
            } else {
                toast.error("Failed to load course details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load course details");
        } finally {
            setLoading(false)
        }
    };



    const buyCourse = () => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-checkout`,
            headers: {
                Authorization: `Bearer ${authorization}`
            },
            data: { courseId: courseId }
        };
        setBuying(true)
        axios.request(options).then(function (response) {
            console.log(response.data);
            window.location.href = response.data.checkoutUrl
        }).catch(function (error) {
            console.error(error);
            toast.error('Failed to purchase course!')
        }).finally(() =>
            setBuying(false)
        );
    }




    const handleButtonClick = () => {
        if (bought) {
            navigate(`/watch-course/${courseId}`)
        } else {
            buyCourse()
        }
    }




    if (loading) {
        return <div className='wrapper min-h-[80vh] px-4'>
            <Loading />
        </div>
    }

    return (
        <div className='wrapper min-h-[80vh] px-4'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='thumbnail relative overflow-hidden h-[35vh] -mt-6 rounded-xl'
                style={backgroundStyle}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white z-10">
                    <h1 className="text-2xl font-bold">{course.title}</h1>
                    <h2 className="text-sm font-semibold">{course.subtitle}</h2>
                </div>
            </motion.div>

            <div className="details-wrapper flex justify-center  my-6 p-3">
                <div className="details w-full max-w-[1200px] flex flex-col md:flex-row gap-6">
                    <div className="main flex-1  p-4 rounded-md bg-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className='text-xl font-semibold mb-2'>About This Course</h1>
                            <p className='text-base mb-4'>{course.description}</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className='text-xl font-semibold mb-2'>What You'll Learn</h2>
                            <p className='text-base'>{course.whatsLearned}</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}

                        className="enroll-card-wrapper w-full md:w-[300px]">
                        <Card className='border-2 border-black w-full'>
                            <CardHeader>
                                <CardTitle>Course Info</CardTitle>
                            </CardHeader>
                            <CardContent className='flex flex-col items-start gap-3'>
                                <div className="flex items-center gap-2">
                                    <FaUser size={20} />
                                    <span>Instructor: {course?.tutor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiClock size={20} />
                                    <span>Total Lecture: {course.lectures?.length ?? 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiClock size={20} />
                                    <span>Category: {course?.category}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiClock size={20} />
                                    <span>Price: {course?.price}$</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaBook size={20} />
                                    <span>Language: {course?.language}</span>
                                </div>
                                {decoded && (decoded.isTutor ? '' :

                                    <Button className={`mt-4 w-full flex items-center justify-center gap-2 ${buying ? 'bg-gray-500 hover:bg-gray-500' : ''} `} onClick={handleButtonClick}>
                                        {bought ? '' : <GiRocket size={20} style={{ transform: 'rotate(270deg)' }} />}
                                        {buying ? <FaSpinner className="animate-spin" /> : ''}
                                        {bought ? 'Watch Lectures' : 'Enroll Now'}

                                    </Button>)
                                }

                                {!bought ?
                                    <Link to={`/watch-course/${courseId}`} className='mt-4 w-full flex items-center justify-center gap-2' >
                                        <Button className='w-full' >
                                            Watch Demo
                                        </Button>
                                    </Link>
                                    : ''
                                }

                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )

}

export default CourseDetails