import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FaVideo } from 'react-icons/fa';
import axios from 'axios';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { useSelector } from 'react-redux';
import { isJwtExpired } from '@/utils/utilities';
import '../App.css'

function WatchCourse() {
    const authorization = useSelector((state) => state.user.authorization);
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [watchData, setWatchData] = useState({});
    const [lectureUrl, setLectureUrl] = useState('');
    const [lectureTitle, setLectureTitle] = useState('');
    const [completedLectures, setCompletedLectures] = useState([]);
    const [selectedLectureId, setSelectedLectureId] = useState('');


    const loadWatchData = () => {
        const options = {
            method: 'GET',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/course/watch`,
            params: { courseId },
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        };

        setLoading(true);
        axios.request(options)
            .then((response) => {
                if (response.data.success) {
                    const data = response.data;
                    setWatchData(data);
                    setProgress(data.progress);
                    setCompletedLectures(data.completedLectureIds);

                    setLectureTitle(data.course.lectures[0].title)
                    setLectureUrl(data.course.lectures[0].url)
                    setSelectedLectureId(data.course.lectures[0]._id)
                } else {
                    setError(true);
                }
            })
            .catch((error) => {
                console.error(error);
                setError(true);
            })
            .finally(() => setLoading(false));
    };


    const handleCheckboxClick = async (lectureId) => {
        let updatedLectures;


        if (completedLectures.includes(lectureId)) {
            updatedLectures = completedLectures.filter(id => id !== lectureId);
        } else {
            updatedLectures = [...completedLectures, lectureId];
        }

        setCompletedLectures(updatedLectures);

        const totalLectures = watchData.course?.lectures?.length || 0;
        const newProgress = Math.round((updatedLectures.length / totalLectures) * 100);
        setProgress(newProgress);

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/course/set-progress`,
                {
                    courseId,
                    newProgress,
                    completedLectureIds: updatedLectures,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authorization}`
                    }
                }
            );
        } catch (err) {
            setProgress(0)
            console.error("Error updating progress:", err);
        }
    };


    useEffect(() => {
        if (!authorization || isJwtExpired(authorization)) {
            navigate('/login');
            return;
        }

        loadWatchData();
    }, [authorization, navigate]);




    if (error) {
        return (
            <div className='w-full wrapper mt-4 min-h-[80vh] p-4 flex justify-center'>
                <Error />
            </div>
        );
    }

    if (loading) {
        return (
            <div className='w-full wrapper mt-4 min-h-[80vh] p-4 flex justify-center'>
                <Loading />
            </div>
        );
    }

    return (
        <div className='w-full wrapper mt-4 min-h-[80vh] p-4 flex justify-center'>
            <div className="course-contents  p-1 w-full max-w-[1300px]">
                <h1 className='text-start font-semibold text-3xl mb-6'>📚 Course Progress</h1>
                <Progress value={progress} />
                <p className='mt-2 text-gray-500'>{progress}% completed</p>

                <div className="details-container flex mt-4 gap-3 flex-col lg:flex-row">

                    <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className='text-xl'>Lectures</CardTitle>
                            </CardHeader>
                            <CardContent className='grid gap-2 w-full px-3 md:px-6 max-h-[50vh] overflow-scroll'>
                                {watchData.course?.lectures?.map((lecture) => (
                                    <div
                                        key={lecture._id}
                                        className={`rounded-md w-full p-3  lecture flex items-center justify-between text-lg font-semibold cursor-pointer ${selectedLectureId === lecture._id ? ' bg-green-300 ' : 'bg-green-100'
                                            }`}
                                        onClick={() => {
                                            setLectureUrl(lecture.url);
                                            setLectureTitle(lecture.title);
                                            setSelectedLectureId(lecture._id);
                                        }}
                                    >
                                        <div className="flex items-center gap-1 ">
                                            <input
                                                type='checkbox'
                                                className=''
                                                checked={completedLectures.includes(lecture._id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleCheckboxClick(lecture._id);
                                                }}
                                            />
                                            <p className=" flexible-text">
                                                {lecture.title}
                                            </p>
                                        </div>
                                        <FaVideo size={20} className="min-w-[20px]" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>


                    <div className="w-full lg:w-2/3">
                        <Card className="w-full">
                            {lectureUrl == '' ?
                                <h1 className='text-xl break-all font-semibold p-5'>
                                    <Error text='Purchase course to watch this video!' />
                                </h1>
                                :
                                <>
                                    <CardHeader>
                                        <CardTitle className=' text-xl break-all'>
                                            Now Watching: <span className='text-red-400'>{lectureTitle}</span><br />
                                            <span className='text-red-400'>
                                                
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='px-0 md:px-6'>
                                        <video src={lectureUrl} controls className='w-full h-full max-h-[300px]' />
                                    </CardContent>
                                </>
                            }
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WatchCourse;
