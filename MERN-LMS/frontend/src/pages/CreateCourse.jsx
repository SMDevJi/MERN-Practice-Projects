import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify';


function CreateCourse() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [whatsLearned, setWhatsLearned] = useState('');
  const [language, setLanguage] = useState('English');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false)

  const navigate = useNavigate()

  const authorization = useSelector((state) => state.user.authorization);
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
      toast.error("Please Login to continue!")
      navigate('/login');
      return;
    }
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      navigate('/login');
      return;
    }
  }, [authorization, navigate]);



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



  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      if (!title || !subtitle || !description || !category || !price || !whatsLearned) {
        toast.error("Please fill out all required fields!");
        setUploading(false)
        return;
      }

      if (!image) {
        toast.error("Please upload a thumbnail image!");
        setUploading(false)
        return;
      }

      const thumbnail = await uploadImageToCloudinary()
      if (!thumbnail) {
        setUploading(false)
        return;
      }
      const options = {
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/course/create`,
        headers: { Authorization: `Bearer ${authorization}` },
        data: {
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
          toast.success("Course created succerssfully!")
          navigate('/dashboard')
        } else {
          toast.error("Error creating course!")
        }
      }).catch(function (error) {
        console.error(error);
        toast.error("Error creating course!")
      }).finally(() => setUploading(false))

    } catch (error) {
      toast.error('Something went wrong!')
    }

  }


  return (
    <div className="w-full form-container p-3 min-h-[85vh] flex justify-center">

      <div className="flex w-full max-w-xl items-center gap-2">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form >
              <div className="flex flex-col gap-6">
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

                  </div>
                  <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Input id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])} />
                  </div>

                </div>

                <Button onClick={handleSubmit} className={`w-full ${uploading ? 'bg-gray-500 hover:bg-gray-500' : ''}`}>
                  {uploading ? 'Creating Course..' : 'Create Course'}
                </Button>
              </div>
            </form>
          </CardContent>

        </Card>



      </div>

    </div>
  )
}

export default CreateCourse