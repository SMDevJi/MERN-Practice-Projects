import Error from '@/components/Error'
import Loading from '@/components/Loading'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { MdLightbulbOutline } from "react-icons/md";
import Webcam from "react-webcam";
import { LuWebcam } from "react-icons/lu";
import { Button } from '@/components/ui/button'



function InterViewDetails() {
    const { interviewId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [interview, setInterview] = useState({})
    const authorization = useSelector((state) => state.user.authorization);
    const coinBalance = useSelector((state) => state.user.coins);
    const navigate = useNavigate()
    const [webcamEnabled, setWebcamEnabled] = useState(false)

    const loadInterview = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/${interviewId}`, {
                headers: {
                    Authorization: `Bearer ${authorization}`
                },
            });

            const interviewData = response.data.interview;

            setInterview(interviewData);
            console.log(interviewData)
        } catch (error) {
            console.error(error);
            setError(error)
            toast.error("Failed to load Interview details");

            if (error.response.status === 401) {
                navigate('/login')
                return
            }
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        loadInterview()
    }, [authorization, navigate, interviewId]);

    if (error) {
        return <div className='wrapper min-h-[80vh] px-4'>
            <Error />
        </div>
    }


    if (loading) {
        return <div className='wrapper min-h-[80vh] px-4'>
            <Loading />
        </div>
    }


    return (
        <div className='details max-w-5xl lg:max-w-6xl mx-auto p-6 my-5'>
            <h1 className='text-xl font-bold '>Let's Get Started</h1>
            <div className="all grid grid-cols-1 md:grid-cols-2 mt-3 my-6 gap-6">
                <div className="details flex flex-col gap-4">
                    <div className="detail outline-1 rounded p-4 space-y-3">
                        <h1 className='text-lg font-bold'>Job Role/Job Position: <span className='font-normal'>{interview.role}</span></h1>
                        <h1 className='text-lg font-bold'>Job Description/Tech Stack: <span className='font-normal'>{interview.description}</span></h1>
                        <h1 className='text-lg font-bold'>Years of Experience: <span className='font-normal'>{interview.lastAttempt?.yearsOfExperience}</span></h1>
                        <h1 className='text-lg font-bold'>Cost: <span className='font-normal'>{interview.cost} coins</span></h1>
                    </div>
                    <div className="detail outline-1 rounded p-4 text-yellow-500 bg-yellow-100">
                        <h1 className='text-lg font-bold flex '><MdLightbulbOutline size={28} color="gold" />Information</h1>
                        <h1 className='text-lg font-semibold'>Enable Video Web Cam and Microphone to Start your Al Generated Mock
                            Interview, It Has 7 question which you can answer and at the last you will
                            get the report on the basis of your answer. NOTE: We never record your
                            video, Web cam access you can disable at any time if you want</h1>
                    </div>
                </div>
                <div className="all-webcam w-full h-full  ">
                    {webcamEnabled ?
                        <div className='flex flex-col items-center justify-start w-full h-full '>
                            <h1>Webcam Preview:</h1>
                            <Webcam
                                className='w-full md:min-w-[360px] h-[250px]'
                                onUserMedia={() => setWebcamEnabled(true)}
                                onUserMediaError={() => setWebcamEnabled(false)}
                                mirrored={true}
                            />
                            <Button className='mt-5 md:mt-15 bg-purple-600 hover:bg-purple-800 w-30 cursor-pointer'
                                onClick={() => navigate(`/conduct-interview/${interviewId}`)}
                            >
                                Start Interview
                            </Button>
                        </div>
                        :
                        <div className='flex flex-col items-end justify-start w-full h-full '>
                            <div className="cam-wrapper  w-full md:min-w-[360px] h-[250px] bg-gray-200 flex justify-center items-center">
                                <LuWebcam className='w-30 h-30' />
                            </div>
                            <Button
                                className='mt-5 bg-gray-400 hover:bg-gray-600 cursor-pointer w-full md:min-w-[360px]'
                                onClick={() => setWebcamEnabled(true)}
                            >
                                Enable Web Cam and Microphone</Button>
                            <Button className='mt-5 md:mt-15 bg-purple-600 hover:bg-purple-800 w-30 cursor-pointer'
                                onClick={() => {
                                    if(Number(coinBalance)<interview.cost){
                                        toast.error('Not enough balance, Please purchase coins!')
                                    }else{
                                        navigate(`/conduct-interview/${interviewId}`)
                                    }
                                }
                            }
                            >
                                Start Interview
                            </Button>
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default InterViewDetails