import React, { useState, useEffect } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';




function Lecture({ lecture, authorization, onUpdate }) {
    const [open, setOpen] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState('')
    const [title, setTitle] = useState(lecture.title)
    const [isFree, setIsFree] = useState(lecture.isFree)

    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0);
    const [courseVideo, setCourseVideo] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

    useEffect(() => {
        if (!courseVideo) return;

        const objectUrl = URL.createObjectURL(courseVideo);
        setVideoPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [courseVideo]);

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


    const deleteLecture = () => {
        const options = {
            method: 'DELETE',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/course/lectures/delete`,
            headers: {
                Authorization: `Bearer ${authorization}`
            },
            data: { lectureId: lecture._id }
        };

        axios.request(options).then(function (response) {
            if (response.data.success) {
                console.log(response.data);
                toast.success('Lecture deleted successfully!')
                onUpdate()
            } else {
                toast.error('Failed to delete lecture!')
            }

        }).catch(function (error) {
            console.error(error);
            toast.error('Failed to delete lecture!')
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdating(true)

        if (!title) {
            toast.error("Title is required!");
            setUpdating(false)
            return;
        }

        let lectureUrl;
        if (!courseVideo) {
            lectureUrl = lecture.url
        } else {
            lectureUrl = await uploadVideoToCloudinary()
            if (!lectureUrl) {
                toast.error("Failed to upload lecture!")
                setUpdating(false)
                return
            }
        }


        const options = {
            method: 'PUT',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/course/lectures/update`,
            headers: {
                Authorization: `Bearer ${authorization}`
            },
            data: { lectureId: lecture._id, url: lectureUrl, title: title, isFree: isFree }
        };

        axios.request(options).then(function (response) {
            if (response.data.success) {
                console.log(response.data);
                toast.success('Lecture updated successfully!')
                setOpen(false)
                setVideoPreviewUrl(null)
                setCourseVideo(null)
                onUpdate()
            } else {
                toast.error('Failed to update lecture!')
            }
        }).catch(function (error) {
            console.error(error);
            toast.error('Failed to update lecture!')
        }).finally(() => {
            setUpdating(false)
        });
    }

    return (
        <Card className="w-full my-3 p-3 flex flex-col sm:flex-row justify-between">
            <h1 className='font-semibold max-w-[60%]'>{lecture.title}</h1>
            <div className="buttons">


                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogTrigger asChild>
                        <Button variant='outline' className='cursor-pointer'>
                            <FaPencilAlt /> Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-h-full overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Lecture</DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <form >
                                    <div className="flex flex-col gap-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Lecture Title</Label>
                                            <Input
                                                id="title"
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. JavaScript Mastery"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label htmlFor="isfreeEdit" className="text-sm font-medium">
                                                Free preview
                                            </label><Switch id="isfreeEdit" checked={isFree}
                                                onCheckedChange={setIsFree} />
                                        </div>
                                        <div className="video-preview">
                                            <h1 className='text-sm font-semibold' >Current Video:</h1>
                                            <video src={lecture.url} className="w-full max-h-60" controls />
                                        </div>




                                        {courseVideo && (
                                            <div className="new-video-preview mt-6">
                                                <h1 className='mb-2 font-semibold text-sm'>New Video..</h1>
                                                <video src={videoPreviewUrl} className="w-full max-h-60" controls />
                                            </div>
                                        )}
                                        <div className="grid w-full max-w-sm items-center gap-3">
                                            <Label htmlFor="courseVideo">Choose new video:</Label>
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







                                        <Button onClick={handleSubmit} className={`w-full mt-3 ${updating ? 'bg-gray-500 hover:bg-gray-500' : ''}`}>
                                            {updating ? 'Updating Lecture..' : 'Update Lecture'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="error flex justify-center">
                            {error && <p className='text-red-500'>{error}</p>}
                        </div>

                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant='destructive' className='ml-2 cursor-pointer' type='button'>
                            <MdDelete /> Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete <span className='text-blue-500'>{lecture.title}</span>?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete '{lecture.title}'.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteLecture} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>





            </div>
        </Card>
    )
}

export default Lecture