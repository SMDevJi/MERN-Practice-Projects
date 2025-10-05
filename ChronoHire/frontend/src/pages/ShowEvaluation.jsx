import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { MdLightbulbOutline } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Chart, defaults } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2'





const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} secs`;
}

const getOptions = (title) => {
    const options = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 18
                }
            }
        }
    }
    return options
}



function ShowEvaluation() {
    const { interviewId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [interview, setInterview] = useState({})
    const [tab, setTab] = useState('responses')
    const authorization = useSelector((state) => state.user.authorization);
    const navigate = useNavigate()

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


    //console.log(interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation?.contentRelevance.relevant))
    //console.log(interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation?.contentRelevance.offTopic))
    return (
        <div className='details max-w-5xl lg:max-w-6xl mx-auto p-5 md:p-6 my-5'>
            <div className="last-attempt w-full">
                <Tabs defaultValue="account" className="w-full" value={tab} onValueChange={setTab}>
                    <TabsList className='w-full h-12 '>
                        <TabsTrigger value="responses" className='text-md sm:text-xl md:text-2xl cursor-pointer'>Responses</TabsTrigger>
                        <TabsTrigger value="statistics" className='text-md sm:text-xl md:text-2xl cursor-pointer'>Statistics</TabsTrigger>
                    </TabsList>



                    <TabsContent value="responses">
                        <div className="last-attempt">
                            {interview.lastAttempt?.overallEvaluation == null ?
                                <div className="no-last ml-2 mt-8 mb-8">
                                    <h1 className='text-xl md:text-2xl font-bold text-red-600 mt-8 mb-4'>Please complete last attempt to see last attempt data!</h1>
                                    <Link
                                        to={`/interview-details/${interviewId}`}>
                                        <Button
                                            className='bg-purple-600 hover:bg-purple-800'>
                                            Complete Attempt
                                        </Button>
                                    </Link>
                                </div>
                                :
                                <>
                                    <div className="infos ml-2">
                                        <h1 className='text-xl md:text-2xl font-bold text-orange-600 underline mb-4'>Last attempt ({interview.lastAttempt?.difficulty}):</h1>
                                        <h1 className='font-bold text-lg md:text-xl mb-2' >Here is your interview feedback.</h1>
                                        <p className='text-blue-600 font-semibold mb-1'>Your overall interview rating: {interview.lastAttempt?.overallScore}/100</p>
                                        <p className='text-gray-500 font-semibold '>Find below interview question with correct answer, Your answer and feedback for improvement.</p>
                                    </div>

                                    <div className="quest-con mt-5 flex justify-center">
                                        <Accordion type="single" collapsible className='gap-2 md:gap-8 grid '>
                                            {interview.lastAttempt?.questions.map((question, idx) =>
                                                <AccordionItem value={`item-${idx}`} key={question._id} className=' rounded-md  w-full'>
                                                    <AccordionTrigger className='text-sm md:text-lg bg-gray-100 p-3 cursor-pointer '>{question.question}</AccordionTrigger>
                                                    <AccordionContent className='mt-2 grid gap-1 p-1'>
                                                        <div className="rating text-red-600 text-sm md:text-lg font-bold p-3 border-1 rounded-md bg-orange-50">Rating: <span className='font-normal'>{question.score}/100</span></div>
                                                        <div className="answer text-red-800 text-sm md:text-lg font-bold p-3 border-1 rounded-md bg-red-50">Your Answer: <span className='font-normal'>{question.transcript}</span></div>
                                                        <div className="suggestion text-yellow-800 text-sm md:text-lg font-bold p-3 border-1 rounded-md bg-green-50">Correct Answer: <span className=' font-normal'>{question.suggestedAns}</span></div>
                                                        <div className="feedback text-blue-800 text-sm md:text-lg font-bold p-3 border-1 rounded-md bg-blue-50">Feedback: <span className=' font-normal'>{question.aiFeedback}</span></div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}

                                        </Accordion>
                                    </div>
                                </>
                            }

                        </div>


                        <Button className='mt-6 ml-2 bg-purple-600 hover:bg-purple-800' onClick={(e) => navigate('/dashboard')}>Go to dashboard</Button>


                        <div className="prev-attempts mt-4 ">
                            <h1 className='text-xl md:text-2xl font-bold text-orange-600 underline mb-4 ml-2'>Previous Attempts:</h1>
                            <div className="prev-con w-full">
                                <div className="title flex justify-between p-3">
                                    <span className='text-sm md:text-lg font-bold '>Attempt Date:</span>
                                    <span className='text-sm md:text-lg font-bold mr-3'>Score:</span>
                                </div>
                                <div className="prev-quest-con">
                                    <Accordion type="single" collapsible className='gap-2 md:gap-8 grid '>
                                        {interview.previousAttempts?.map((attempt, idx) =>
                                            <AccordionItem value={`item-${idx}`} key={attempt._id} className=' rounded-md  w-full'>
                                                <AccordionTrigger className='!no-underline text-sm md:text-lg bg-gray-100 p-3 cursor-pointer '>
                                                    <div className="group trigger flex justify-between w-full">
                                                        <span className='group-hover:underline group-hover:decoration-black'>{new Date(attempt.attemptDate).toLocaleString(
                                                            'en-US', {
                                                            year: 'numeric', month: 'short', day: 'numeric',
                                                            hour: '2-digit', minute: '2-digit', hour12: true
                                                        }
                                                        )}</span>
                                                        <span className=' text-blue-400 group-hover:underline group-hover:decoration-blue-400'>{attempt.overallScore}</span>
                                                    </div>

                                                </AccordionTrigger>
                                                <AccordionContent className='mt-2 grid gap-1 p-1'>
                                                    <div className="prev-details-con p-4 border-1 rounded-md bg-green-100">
                                                        <h1 className='text-sm md:text-lg font-bold text-green-700'>Difficulty: <span className='font-normal'>{attempt?.difficulty}</span></h1>
                                                        <h1 className='text-sm md:text-lg font-bold text-green-700'>Duration: <span className='font-normal'>{formatDuration(attempt?.duration)}</span></h1>
                                                        <h1 className='text-sm md:text-lg font-bold text-green-700'>Relevance: <span className='font-normal'>Relevant: {attempt.overallEvaluation.contentRelevance?.relevant}%, Off-topic: {attempt.overallEvaluation.contentRelevance?.offTopic}%</span></h1>
                                                        <h1 className='text-sm md:text-lg font-bold text-green-700'>Completeness: <span className='font-normal'>Full: {attempt.overallEvaluation.answerCompleteness?.full}%, Partial: {attempt.overallEvaluation.answerCompleteness?.partial}%, Missed: {attempt.overallEvaluation.answerCompleteness?.missed}%</span></h1>
                                                        <h1 className='text-sm md:text-lg font-bold text-green-700'>Grammar & Vocabulary: <span className='font-normal'>Correct: {attempt.overallEvaluation.grammarVocabulary?.correct}%, Minor Errors: {attempt.overallEvaluation.grammarVocabulary?.minorErrors}%, Major Errors: {attempt.overallEvaluation.grammarVocabulary?.majorErrors}%</span></h1>
                                                        <h1 className='text-sm md:text-lg font-bold text-green-700'>Years of Experience: <span className='font-normal'>{attempt.yearsOfExperience}</span></h1>
                                                    </div>

                                                </AccordionContent>
                                            </AccordionItem>
                                        )}

                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </TabsContent>






                    <TabsContent value="statistics">
                        <div className="space-y-8">

                            {/* Last Attempt Section */}
                            <div>

                                {interview.lastAttempt?.overallEvaluation == null ?
                                    <div className="no-last ml-2 mt-8 mb-8">
                                        <h1 className='text-xl md:text-2xl font-bold text-red-600 mt-8 mb-4'>Please complete last attempt to see last attempt data!</h1>
                                        <Link
                                            to={`/interview-details/${interviewId}`}>
                                            <Button
                                                className='bg-purple-600 hover:bg-purple-800'>
                                                Complete Attempt
                                            </Button>
                                        </Link>
                                    </div>
                                    :
                                    <>
                                        <h2 className="text-xl md:text-2xl font-bold text-orange-600 underline mb-4 mt-4"> Last Attempt Overview:</h2>
                                        <div className="bg-gray-100 p-3 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                                            <div className="prev-score flex justify-center items-center flex-col">
                                                <h1 className='text-xl font font-extrabold text-green-400 mb-4'><span className='text-green-500'>Role: </span>{interview.role}</h1>
                                                <h1 className='font-extrabold text-gray-500'>Score Summary:</h1>
                                                <p>Score: {interview.lastAttempt?.overallScore}/100</p>
                                                <p>Date: {new Date(interview.lastAttempt?.attemptDate).toLocaleString(
                                                    'en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit', hour12: true
                                                }
                                                )}</p>
                                                <p>Difficulty: {interview.lastAttempt?.difficulty}</p>
                                                <p>Duration: {formatDuration(interview.lastAttempt?.duration)}</p>
                                                <p>Years of Experience: {interview.lastAttempt?.yearsOfExperience}</p>
                                            </div>

                                            <div className="dough-wrapper max-w-xs w-full mx-auto">
                                                <Doughnut className='w-full h-[250px]' options={getOptions('Content Relevance')}
                                                    data={{
                                                        labels: ['Relevant', 'Off Topic'],
                                                        datasets: [{
                                                            label: 'Content Relevance',
                                                            data: [
                                                                interview.lastAttempt?.overallEvaluation?.contentRelevance.relevant,
                                                                interview.lastAttempt?.overallEvaluation?.contentRelevance.offTopic
                                                            ],
                                                            backgroundColor: [
                                                                'rgb(255, 99, 132)',
                                                                'rgb(255, 205, 86)'
                                                            ],
                                                            hoverOffset: 4
                                                        }]
                                                    }}

                                                />
                                            </div>

                                            <div className="dough-wrapper max-w-xs w-full mx-auto">
                                                <Doughnut className='w-full h-[250px]' options={getOptions("Grammar & Vocabulary")}
                                                    data={{
                                                        labels: ['Correct', 'Minor Errors', 'Major Errors'],
                                                        datasets: [{
                                                            label: 'Grammar & Vocabulary',
                                                            data: [
                                                                interview.lastAttempt?.overallEvaluation?.grammarVocabulary.correct,
                                                                interview.lastAttempt?.overallEvaluation?.grammarVocabulary.minorErrors,
                                                                interview.lastAttempt?.overallEvaluation?.grammarVocabulary.majorErrors
                                                            ],
                                                            backgroundColor: [
                                                                'rgb(255, 99, 132)',
                                                                'rgb(255, 205, 86)',
                                                                'rgb(50, 168, 82)'
                                                            ],
                                                            hoverOffset: 4
                                                        }]
                                                    }}
                                                />
                                            </div>

                                            <div className="dough-wrapper max-w-xs w-full mx-auto">
                                                <Doughnut className='w-full h-[250px]' options={getOptions("Answer Completeness")}
                                                    data={{
                                                        labels: ['Full', 'Partial', 'Missed'],
                                                        datasets: [{
                                                            label: 'Answer Completeness',
                                                            data: [
                                                                interview.lastAttempt?.overallEvaluation?.answerCompleteness.full,
                                                                interview.lastAttempt?.overallEvaluation?.answerCompleteness.partial,
                                                                interview.lastAttempt?.overallEvaluation?.answerCompleteness.missed
                                                            ],
                                                            backgroundColor: [
                                                                'rgb(255, 99, 132)',
                                                                'rgb(255, 205, 86)',
                                                                'rgb(50, 168, 82)'
                                                            ],
                                                            hoverOffset: 4
                                                        }]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>

                            {/* Previous Attempts Section */}
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-orange-600 underline mb-4 mt-4"> Previous Attempts Analysis:</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 py-8 bg-gray-100">
                                    <div className="line-wrapper max-w-xl w-full mx-auto">
                                        <Line
                                            className='w-full h-[250px]'

                                            options={getOptions("Score/Duration Over Time")}
                                            data={{
                                                labels: interview?.previousAttempts?.map(atmpt => [
                                                    new Date(atmpt.attemptDate).toLocaleDateString('en-IN'),
                                                    new Date(atmpt.attemptDate).toLocaleTimeString('en-IN')
                                                ]),
                                                datasets: [{
                                                    label: "Score",
                                                    data: interview?.previousAttempts?.map(atmpt => atmpt.overallScore),
                                                    fill: false,
                                                    borderColor: 'rgb(75, 192, 192)',
                                                    tension: 0.1,
                                                    yAxisID: 'y',
                                                },
                                                {
                                                    label: "Duration (mins)",
                                                    data: interview?.previousAttempts?.map(atmpt => atmpt.duration / 1000 / 60),
                                                    fill: false,
                                                    borderColor: 'rgb(255, 99, 132)',
                                                    tension: 0.1,
                                                    yAxisID: 'y1',
                                                }
                                                ]
                                            }}
                                        />
                                    </div>

                                    {/*Its Stacked bar chart  */}
                                    <div className="bar-wrapper-relevance max-w-xl w-full mx-auto">
                                        <Bar
                                            className='w-full h-[250px]'

                                            options={{
                                                ...(getOptions('Content Relevance')),
                                                scales: {
                                                    x: {
                                                        stacked: true,
                                                    },
                                                    y: {
                                                        stacked: true,
                                                    },
                                                },
                                            }}

                                            data={{
                                                labels: interview?.previousAttempts?.map(atmpt => [
                                                    new Date(atmpt.attemptDate).toLocaleDateString('en-IN'),
                                                    new Date(atmpt.attemptDate).toLocaleTimeString('en-IN')
                                                ]),
                                                datasets: [
                                                    {
                                                        label: 'Relevant',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation?.contentRelevance.relevant),
                                                        backgroundColor: 'rgba(75, 192, 192, 0.8)',
                                                    },
                                                    {
                                                        label: 'Off Topic',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation?.contentRelevance.offTopic),
                                                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                                                    },
                                                ],
                                            }} />

                                    </div>

                                    <div className="bar-wrapper-grammar max-w-xl w-full mx-auto">
                                        <Bar
                                            className='w-full h-[250px]'

                                            options={{
                                                ...(getOptions('Grammar & Vocabulary')),
                                                scales: {
                                                    x: {
                                                        stacked: true,
                                                    },
                                                    y: {
                                                        stacked: true,
                                                    },
                                                },
                                            }}

                                            data={{
                                                labels: interview?.previousAttempts?.map(atmpt => [
                                                    new Date(atmpt.attemptDate).toLocaleDateString('en-IN'),
                                                    new Date(atmpt.attemptDate).toLocaleTimeString('en-IN')
                                                ]),
                                                datasets: [
                                                    {
                                                        label: 'Correct',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation?.grammarVocabulary.correct),
                                                        backgroundColor: '#4ade80',
                                                    },
                                                    {
                                                        label: 'Minor Errors',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation?.grammarVocabulary.minorErrors),
                                                        backgroundColor: '#facc15',
                                                    },
                                                    {
                                                        label: 'Major Errors',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation.grammarVocabulary.majorErrors),
                                                        backgroundColor: '#f87171',
                                                    }


                                                ],
                                            }} />
                                    </div>


                                    <div className="bar-wrapper-complete max-w-xl w-full mx-auto">
                                        <Bar
                                            className='w-full h-[250px]'

                                            options={{
                                                ...(getOptions('Answer Completeness')),
                                                scales: {
                                                    x: {
                                                        stacked: true,
                                                    },
                                                    y: {
                                                        stacked: true,
                                                    },
                                                },
                                            }}

                                            data={{
                                                labels: interview?.previousAttempts?.map(atmpt => [
                                                    new Date(atmpt.attemptDate).toLocaleDateString('en-IN'),
                                                    new Date(atmpt.attemptDate).toLocaleTimeString('en-IN')
                                                ]),
                                                datasets: [
                                                    {
                                                        label: 'Full',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation.answerCompleteness.full),
                                                        backgroundColor: '#60a5fa',
                                                    },
                                                    {
                                                        label: 'Partial',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation.answerCompleteness.partial),
                                                        backgroundColor: '#fbbf24',
                                                    },
                                                    {
                                                        label: 'Missed',
                                                        data: interview.previousAttempts?.map(atmpt => atmpt.overallEvaluation.answerCompleteness.missed),
                                                        backgroundColor: '#ef4444',
                                                    }


                                                ],
                                            }} />
                                    </div>
                                </div>
                            </div>

                        </div>

                    </TabsContent>
                </Tabs>


            </div>


        </div>
    )
}

export default ShowEvaluation