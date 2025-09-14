import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { add } from '@/redux/userSlice';
import { toast } from 'react-toastify';
import { isJwtExpired } from '@/utils/utilities';
import CourseCard from '@/components/CourseCard';
import Loading from '@/components/Loading';



function Profile() {
  const [image, setImage] = useState(null);
  const [imgPreviewUrl, setImgPreviewUrl] = useState(null)
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [couseLoading, setCouseLoading] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])

  const authorization = useSelector((state) => state.user.authorization);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setImgPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);


  let decoded = null;

  try {
    if (authorization) {
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

    setEditName(decoded.name || '');
  }, [authorization, navigate]);


  const loadEnrolledCourses = () => {
    const params = decoded.enrolledCourses.map(id => `courseId=${id}`).join('&');
    const options = {
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/course/get-course/?${params}`,
    };
    setCouseLoading(true)
    axios.request(options).then(function (response) {
      console.log(response.data);
      setEnrolledCourses(response.data.courses)
    }).catch(function (error) {
      console.error(error);
    }).finally(() =>
      setCouseLoading(false)
    );
  }


  useEffect(() => {
    loadEnrolledCourses()
  }, [])

  const getSignature = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/generate-signature`,
      { field: 'ProfilePic' },
      {
        headers: { Authorization: `Bearer ${authorization}` },
      }
    );
    return res.data.signature;
  };

  const uploadImageToCloudinary = async () => {
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
    //console.log(res.data)
    return res.data.secure_url;
  };

  const updateProfile = async (pictureUrl) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile/update`,
      {
        name: editName,
        picture: pictureUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    const newToken = response.data.authorization;
    localStorage.setItem('authorization', newToken)
    dispatch(add(newToken));
  };

  const handleFileUpload = async () => {
    try {
      setSaving(true)
      let pictureUrl = decoded.picture;

      if (image) {
        pictureUrl = await uploadImageToCloudinary();
      }

      await updateProfile(pictureUrl);
      setOpen(false)
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setSaving(false)
      toast.success("Profile updated successfully!")
    }
  };

  if (!decoded) return null;

  return (
    <div className='wrapper w-full min-h-[95vh] flex flex-col items-center p-3'>
      <div className="shadow-sm shadow-gray-400 profile-details-wrapper w-full max-w-[400px] h-full mt-25 rounded-xl p-6 break-all">
        <div className="section1 flex items-center gap-4">
          <img
            className='w-20 h-20 rounded-full object-cover'
            src={decoded.picture || "/default-profile.png"}
            alt="Profile"
          />
          <div className="profile-details">
            <h1>{decoded.name}</h1>
            <p>{decoded.email}</p>
          </div>
        </div>
        <div className="section2 mt-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className='shadow-sm shadow-gray-200 hover:translate-0.25 ease-in-out duration-300 hover:shadow-gray-300 px-2 py-1 rounded-sm font-semibold border border-gray-100'>
                Edit Profile
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="name" className='ml-2'>Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  {image && (
                    <div className="new-video-preview mt-6">
                      <h1 className='mb-2 font-semibold text-sm'>New Picture..</h1>
                      <img src={imgPreviewUrl} className="w-full max-h-60" />
                    </div>
                  )}
                  <Label htmlFor="picture" className='ml-2'>Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="error flex justify-center">
                {error && <p className='text-red-500'>{error}</p>}
              </div>
              <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                  <Button variant='default'>Close</Button>
                </DialogClose>
                <Button className={saving ? 'bg-gray-500 hover:bg-gray-500' : ''} variant='default' onClick={handleFileUpload}>
                  {saving ? 'Saving..' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="enrolled-courses mt-5">
        <h1 className='text-xl font-semibold text-center'>Your purchased courses</h1>
        {couseLoading ? <Loading /> :
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1500px] p-5">
            {decoded && enrolledCourses.map(course => {
              let courseArray = {
                id: course._id,
                title: course.title,
                tutor: course.tutor,
                image: course.thumbnail
              };
              return <CourseCard product={courseArray} />
            }
            )}
          </div>
        }

      </div>
    </div>
  );
}

export default Profile;
