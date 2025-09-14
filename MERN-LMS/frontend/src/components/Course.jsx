import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaPencilAlt } from "react-icons/fa";
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { toast } from 'react-toastify';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';


function Course({ product, authorization, onCourseChange }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [title, setTitle] = useState(product.title);
    const [subtitle, setSubtitle] = useState(product.subtitle);
    const [description, setDescription] = useState(product.description);
    const [category, setCategory] = useState(product.category);
    const [price, setPrice] = useState(product.price);
    const [whatsLearned, setWhatsLearned] = useState(product.whatsLearned);
    const [language, setLanguage] = useState('English');
    const [image, setImage] = useState();
    const [preThumb, setPreThumb] = useState(product.thumbnail)
    const [uploading, setUploading] = useState(false)

    const navigate = useNavigate()

    const getSignature = async () => {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/generate-signature`,
            { field: 'Thumbnail' },
            {
                headers: { Authorization: `Bearer ${authorization}` },
            }
        );
        return res.data.signature;
    };


    const uploadImageToCloudinary = async () => {
        try {
            const { timestamp, signature, apiKey, cloudName, folder } = await getSignature();

            const formData = new FormData();
            formData.append('file', image);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('folder', folder);

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (res.data?.secure_url) {
                toast.success('Thumbnail uploaded successfully!')
                console.log(res.data)
                return res.data.secure_url;
            } else {
                toast.error('Failed to get image url!');
            }

        } catch (error) {
            console.error('Image upload failed:', error);
            toast.error("Failed to upload thumbnail!");
            return null;
        }
    };


    const deleteCourse = () => {
        const options = {
            method: 'DELETE',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/course/delete`,
            headers: {
                Authorization: `Bearer ${authorization}`
            },
            data: { courseId: product._id }
        };

        axios.request(options).then(function (response) {
            if (response.data.success) {
                console.log(response.data);
                toast.success('Course deleted successfully!')
                onCourseChange(response.data.courses)
            } else {
                toast.error('Failed to delete Course!')
            }

        }).catch(function (error) {
            console.error(error);
            toast.error('Failed to delete Course!')
        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)
        try {
            if (!title || !subtitle || !description || !category || !price || !whatsLearned) {
                toast.error("Please fill out all required fields!");
                setUploading(false)
                return;
            }

            let thumbnail = preThumb;
            if (image) {
                const uploadedUrl = await uploadImageToCloudinary();
                if (!uploadedUrl) {
                    setUploading(false);
                    return;
                }
                thumbnail = uploadedUrl;
            }

            const options = {
                method: 'PUT',
                url: `${import.meta.env.VITE_BACKEND_URL}/api/course/update`,
                headers: { Authorization: `Bearer ${authorization}` },
                data: {
                    courseId: product._id,
                    title: title,
                    subtitle: subtitle,
                    description: description,
                    category: category,
                    price: price,
                    whatsLearned: whatsLearned,
                    language: language,
                    thumbnail: thumbnail
                }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
                if (response.data.success) {
                    toast.success("Course updated succerssfully!")
                    setOpen(false)
                    onCourseChange(response.data.courses)
                } else {
                    toast.error("Error updating course!")
                }
            }).catch(function (error) {
                console.error(error);
                toast.error("Error updating course!")
            }).finally(() => setUploading(false))

        } catch (error) {
            toast.error('Something went wrong!')
        }

    }


    return (
        <Card className="w-full my-3 p-5 flex flex-col sm:flex-row justify-between">
            <h1 className='font-semibold'>{product.title}</h1>
            <div className="buttons">


                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogTrigger asChild>
                        <Button variant='outline' className='cursor-pointer'>
                            <FaPencilAlt /> Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-h-full overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Course</DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <form >
                                    <div className="flex flex-col gap-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Course Title</Label>
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
                                            <Label htmlFor="subtitle">Subtitle</Label>
                                            <Input
                                                id="subtitle"
                                                type="text"
                                                value={subtitle}
                                                onChange={(e) => setSubtitle(e.target.value)}
                                                placeholder="e.g. Learn JavaScript from beginner to pro"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                type="text"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Write a short course description"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Input
                                                id="category"
                                                type="text"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                placeholder="e.g. Web Development"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Price ($)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="e.g. 29.99"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="whatsLearned">What will students learn?</Label>
                                            <Textarea
                                                id="whatsLearned"
                                                type="text"
                                                value={whatsLearned}
                                                onChange={(e) => setWhatsLearned(e.target.value)}
                                                placeholder="Describe what the students will learn from this course"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="language">Course Language</Label>

                                            <Select id="language" value={language} onValueChange={setLanguage}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="English">English</SelectItem>
                                                    <SelectItem value="Hindi">Hindi</SelectItem>
                                                </SelectContent>
                                            </Select>

                                        </div>
                                        <div className="grid gap-2">
                                            <div className="img-preview">
                                                {image && (
                                                    <div className="img-preview">
                                                        <img src={URL.createObjectURL(image)} alt="Thumbnail Preview" className="w-full h-auto" />
                                                    </div>
                                                )}
                                                {preThumb && (
                                                    <div className="img-preview">
                                                        <img src={preThumb} alt="Thumbnail Preview" className="w-full h-auto" />
                                                    </div>
                                                )}

                                            </div>
                                            <div className="grid w-full max-w-sm items-center gap-3">
                                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                                <Input id="thumbnail"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        setPreThumb(null)
                                                        return setImage(e.target.files[0])
                                                    }} />
                                            </div>

                                        </div>

                                        <Button onClick={handleSubmit} className={`w-full ${uploading ? 'bg-gray-500 hover:bg-gray-500' : ''}`}>
                                            {uploading ? 'Updating Course..' : 'Update Course'}
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



                <Link to={`/add-lecture/${product._id}`}>
                    <Button variant='secondary' className='cursor-pointer'>
                        <FaPlus /> Add Lecture
                    </Button>
                </Link>


                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' className='ml-2 cursor-pointer' type='button'>
                            <MdDelete />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete <span className='text-blue-500'>{product.title}</span>?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete '{product.title}'.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteCourse} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>



            </div>
        </Card>
    )
}

export default Course