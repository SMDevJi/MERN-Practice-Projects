import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { LuWebcam } from 'react-icons/lu'
import { MdLightbulbOutline } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Webcam from 'react-webcam'
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { toast } from 'sonner'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { FaMicrophoneSlash, FaMicrophone } from "react-icons/fa";
import { setCoins } from '@/redux/userSlice'

function ConductInterview() {
    const { interviewId } = useParams();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [allError, setAllError] = useState(false);
    const [interview, setInterview] = useState({});
    const authorization = useSelector((state) => state.user.authorization);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [answersArr, setAnswersArr] = useState([]);
    const [disabledBtns, setDisabledBtns] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [isUserRecording, setIsUserRecording] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {
        console.log(userAnswer, answersArr)
    }, [isUserRecording])

    //for fixing bug: vite excluding the library in built version
    useEffect(() => {
        // Prevent tree-shaking of SpeechRecognition
        if (typeof window !== 'undefined') {
            window.__keep_SR = SpeechRecognition;
        }
    }, []);



    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const loadInterview = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/${interviewId}`, {
                headers: {
                    Authorization: `Bearer ${authorization}`
                },
            });

            const interviewData = response.data.interview;
            const qnaArray = response.data.interview.lastAttempt.questions;

            setInterview(interviewData);
            setAnswersArr(qnaArray);
        } catch (error) {
            console.error(error);
            setAllError(error);
            toast.error("Failed to load Interview details");

            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }
        } finally {
            setLoading(false);
            setStartTime(performance.now());
        }
    };

    const textToSpeech = () => {
        try {
            const speech = new SpeechSynthesisUtterance(interview.lastAttempt.questions[selectedIdx].question);
            speechSynthesis.speak(speech);
        } catch (error) {
            toast.error('Error! Text to speech not supported in your browser!');
        }
    };

    const handleRecordButtonClick = async () => {
        if (!browserSupportsSpeechRecognition) {
            toast.error("Speech recognition not supported in this browser!");
            return;
        }

        if (isUserRecording) {
            // Stop Recording
            SpeechRecognition.stopListening();
            setIsUserRecording(false);
            setUserAnswer(transcript.trim());

            setTimeout(() => {
                commitAnswerImmediately();
            }, 400);
        } else {
            // Start Recording
            await navigator.mediaDevices.getUserMedia({ audio: true });

            resetTranscript();
            setUserAnswer('');
            setIsUserRecording(true);
            SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        }
    };

    const commitAnswerImmediately = () => {
        if (!transcript.trim()) {
            toast.warning("No answer detected!");
            return;
        }

        setAnswersArr(prevArr => {
            const updated = [...prevArr];
            updated[selectedIdx] = {
                ...updated[selectedIdx],
                transcript: transcript.trim()
            };
            return updated;
        });

        setDisabledBtns(prev => [...new Set([...prev, selectedIdx])]);
        toast.success("Answer recorded successfully!");
        resetTranscript();
    };

    useEffect(() => {
        loadInterview();
    }, [authorization, navigate, interviewId]);

    const submitInterview = async () => {
        const now = performance.now();
        const timeDiff = (now - startTime).toFixed(2);

        if (disabledBtns.length !== answersArr.length) {
            toast.error("Please answer all questions!");
            return;
        }

        const simplified = answersArr.map(item => ({
            _id: item._id,
            transcript: item.transcript
        }));

        try {
            setSubmitting(true);
            setAllError(null);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/submit/${interviewId}`,
                {
                    answers: simplified,
                    duration: timeDiff
                },
                {
                    headers: {
                        Authorization: `Bearer ${authorization}`
                    }
                }
            );

            if (response.data.success) {
                dispatch(setCoins(response.data.coinBalance));
                localStorage.setItem('coins', response.data.coinBalance);
                navigate(`/show-evaluation/${interviewId}`);
            }
        } catch (err) {
            console.error("Error submitting interview:", err);
            setAllError("Failed to submit Interview!");
        } finally {
            setSubmitting(false);
        }
    };

    if (allError) {
        return (
            <div className='wrapper min-h-[80vh] px-4'>
                <Error />
            </div>
        );
    }

    if (loading) {
        return (
            <div className='wrapper min-h-[80vh] px-4'>
                <Loading />
            </div>
        );
    }

    if (submitting) {
        return (
            <div className='wrapper min-h-[80vh] px-4 flex justify-center items-center flex-col'>
                <Loading />
                <h1 className='text-center text-2xl -mt-15 text-gray-500'>
                    Submitting and evaluating your answers, please wait..
                </h1>
            </div>
        );
    }

    return (
        <div className='details max-w-5xl lg:max-w-6xl mx-auto p-2 sm:p-5 my-5 h-full min-h-[85vh]'>
            <div className="all grid grid-cols-1 md:grid-cols-2 mt-3 my-6 h-[65vh] w-full">
                <div className="details flex flex-col outline-1 rounded-md p-4 space-y-8 h-full">
                    <div className="detail rounded-xl p-2 space-y-4">
                        <div className="qlabels grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 gap-y-3 font-semibold">
                            {interview?.lastAttempt?.questions.map((question, idx) =>
                                <button key={idx}
                                    disabled={disabledBtns?.includes(idx)}
                                    className={`${disabledBtns.includes(idx) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} outline-1 rounded-xl px-1.5 py-1.5 text-xs sm:text-sm ${selectedIdx === idx ? 'bg-blue-800 text-white' : ''}`}
                                    onClick={() => {
                                        if (!isUserRecording && !listening) {
                                            setSelectedIdx(idx);
                                        }
                                    }}>
                                    Question #{idx + 1}
                                </button>
                            )}
                        </div>
                        <h1 className='text-md font-semibold'>
                            {interview.lastAttempt?.questions[selectedIdx].question}
                        </h1>
                        <HiOutlineSpeakerWave size={25} className='cursor-pointer' onClick={textToSpeech} />
                    </div>

                    <div className="detail outline-1 rounded p-4 text-blue-500 bg-blue-100 mb-5 text-sm">
                        <h1 className='font-bold flex leading-none items-center'>
                            <MdLightbulbOutline size={28} />Note:
                        </h1>
                        <h1 className='font-semibold'>
                            Click on Record Answer when you want to answer the question. At the end of
                            interview, we will give you the feedback along with the correct answer for each of
                            the questions and your answer to compare it.
                        </h1>
                    </div>
                </div>

                <div className="all-webcam w-full h-full mt-6 md:mt-0 flex justify-center md:justify-end">
                    <div className='flex flex-col items-center md:justify-end w-[90%] h-full '>
                        <h1>Webcam Preview:</h1>
                        <div className="wc-wrapper w-full h-full bg-black flex justify-center items-center p-4">
                            <Webcam className='w-full' mirrored={true} />
                        </div>

                        <Button variant='outline' className='mt-4 cursor-pointer'
                            onClick={handleRecordButtonClick}>
                            {isUserRecording
                                ? <h1 className='text-red-600 flex gap-2 items-center'><FaMicrophoneSlash />Stop Recording..</h1>
                                : <h1 className='flex gap-2 items-center'><FaMicrophone />Record Answer</h1>
                            }
                        </Button>

                        <h1 className='mt-2 font-semibold'>Answer preview:</h1>
                        <p>{transcript}</p>

                        <div className="nav-btns mt-5 md:mt-10 mb-8 w-full flex justify-start sm:justify-end flex-wrap gap-2 ">
                            {selectedIdx > 0 && (
                                <Button className='bg-purple-600 hover:bg-purple-800 cursor-pointer px-3'
                                    onClick={() => {
                                        if (isUserRecording && listening) {
                                            toast.error("Stop recording before navigating.");
                                            return;
                                        }
                                        const newIndex = selectedIdx - 1;
                                        if (disabledBtns.includes(newIndex)) {
                                            toast.warning("This question has already been answered.");
                                            return;
                                        }
                                        setSelectedIdx(id => id - 1);
                                    }}>
                                    Previous Question
                                </Button>
                            )}

                            {selectedIdx < answersArr.length - 1 ? (
                                <Button className='bg-purple-600 hover:bg-purple-800 cursor-pointer px-3'
                                    onClick={() => {
                                        if (isUserRecording && listening) {
                                            toast.error("Stop recording before moving to next question.");
                                            return;
                                        }
                                        const newIndex = selectedIdx + 1;
                                        if (disabledBtns.includes(newIndex)) {
                                            toast.warning("This question has already been answered.");
                                            return;
                                        }
                                        setSelectedIdx(id => id + 1);
                                    }}>
                                    Next Question
                                </Button>
                            ) : (
                                <Button className='bg-purple-600 hover:bg-purple-800 cursor-pointer px-3'
                                    onClick={submitInterview}>
                                    End Interview
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConductInterview;
