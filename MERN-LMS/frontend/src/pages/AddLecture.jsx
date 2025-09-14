import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import Lecture from '@/components/Lecture'
import { isJwtExpired } from '@/utils/utilities'

function AddLecture() {
    const { courseId } = useParams();
    console.log(courseId)
    const navigate = useNavigate();
    const authorization = useSelector((state) => state.user.authorization);

    const [decoded, setDecoded] = useState(null);
    const [course, setCourse] = useState({});
    const [title, setTitle] = useState('');
    const [courseVideo, setCourseVideo] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [isFree, setIsFree] = useState(false)
    const [lectures, setLectures] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0);


    useEffect(() => {
        if (!courseVideo) return;

        const objectUrl = URL.createObjectURL(courseVideo);
        setVideoPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [courseVideo]);


    const [error, setError] = useState('')




    const getSignature = async () => {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/generate-signature`,
            { field: 'Lecture' },
            {
                headers: { Authorization: `Bearer ${authorization}` },
            }
        );
        return res.data.signature;
    };

    const uploadVideoToCloudinary = async () => {
        setUploading(true)
        const { timestamp, signature, apiKey, cloudName, folder } = await getSignature();

        const formData = new FormData();
        formData.append('file', courseVideo);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            }
        ).finally(() => {
            setUploading(false)
        });

        setUploadProgress(0);
        console.log(res.data)
        return res.data.secure_url;
    };





    useEffect(() => {
        if (!authorization) {
            navigate('/login');
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(authorization);
        } catch (err) {
            console.error("Invalid token");
            navigate('/login');
            return;
        }


        if (isJwtExpired(authorization)) {
            console.warn("Token expired");
            navigate('/login');
            return;
        }

        setDecoded(decoded);
        loadCourse(decoded);
    }, [authorization, navigate, courseId]);


    const loadCourse = async (decoded) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/course/get-editable-course`, {
                params: { courseId },
                headers: {
                    Authorization: `Bearer ${authorization}`
                },


            });

            if (response.data.success) {
                const courseData = response.data.course;


                if (courseData.tutorId !== decoded.id) {
                    toast.error("You are not authorized to access this course.");
                    navigate('/');
                    return;
                }

                setCourse(courseData);
                setLectures(courseData.lectures)
            } else {
                toast.error("Failed to load course details");
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load course details");
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdating(true)
        try {
            if (!title) {
                toast.error("Please fill out all required fields!");
                setUpdating(false)
                return;
            }

            if (!courseVideo) {
                toast.error("Please upload the course video!");
                setUpdating(false)
                return;
            }

            const lectureUrl = await uploadVideoToCloudinary()
            if (!lectureUrl) {
                setUpdating(false)
                return;
            }
            const options = {
                method: 'POST',
                url: `${import.meta.env.VITE_BACKEND_URL}/api/course/lectures/add`,
                headers: { Authorization: `Bearer ${authorization}` },
                data: {
                    courseId,
                    title,
                    url: lectureUrl,
                    isFree
                }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
                if (response.data.success) {
                    toast.success("Lecture added succerssfully!")
                    setLectures(response.data.lectures)
                } else {
                    toast.error("Error adding course!")
                }
            }).catch(function (error) {
                console.error(error);
                toast.error("Error adding course!")
            }).finally(() => setUpdating(false))

        } catch (error) {
            toast.error('Something went wrong!')
        }

    }

    return (
        <div className='form-container my-10 min-h-[80vh] w-full flex justify-center'>
            <Card className="w-full max-w-xl h-full">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Add Lecture to: <span className='text-blue-700'>{course.title}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-8">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Lecture Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter video title"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                {courseVideo && (
                                    <div className="video-preview">
                                        <video src={videoPreviewUrl} className="w-full max-h-60" controls />
                                    </div>
                                )}
                                <div className="grid w-full max-w-sm items-center gap-3">
                                    <Label htmlFor="courseVideo">Video Upload</Label>
                                    <Input
                                        id="courseVideo"
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setCourseVideo(e.target.files[0])}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-3">
                                    {uploading ? <div className='my-6'>
                                        <h1 className='mb-2 font-semibold text-sm'>Uploading Video..</h1>
                                        <Progress value={uploadProgress} className="w-full" />
                                    </div>
                                        : ""}

                                </div>
                            </div>

                            {error && (
                                <div className="error flex justify-center">
                                    <h1 className="text-red-500">{error}</h1>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <label htmlFor="isfree" className="text-sm font-medium">
                                    Free preview
                                </label><Switch id="isfree" checked={isFree}
                                    onCheckedChange={setIsFree} />
                            </div>
                            <Button
                                type="submit"
                                className={`w-full ${updating ? 'bg-gray-500 hover:bg-gray-500' : ''}`}
                                disabled={updating}
                            >
                                {updating ? 'Creating Lecture...' : 'Create Lecture'}
                            </Button>

                            <div className="grid ">
                                <h1 className='font-bold ml-2'>Lectures:</h1>
                                {lectures.map(lecture =>
                                    <Lecture lecture={lecture} key={lecture._id} authorization={authorization} onUpdate={() => loadCourse(decoded)} />
                                )}
                            </div>

                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddLecture;
