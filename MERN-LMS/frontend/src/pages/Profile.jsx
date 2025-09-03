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



function Profile() {
  const [image, setImage] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const authorization = useSelector((state) => state.user.authorization);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let decoded = null;

  try {
    if (authorization) {
      decoded = jwtDecode(authorization);
    }
  } catch (err) {
    console.error("Invalid token");
  }

  useEffect(() => {
    if (!authorization || !decoded) {
      navigate('/login');
      return;
    }

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      navigate('/login');
      return;
    }

    setEditName(decoded.name || '');
  }, [authorization, navigate]);

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
    }finally{
      setSaving(false)
    }
  };

  if (!decoded) return null;

  return (
    <div className='container w-full min-h-[95vh] flex justify-center p-3'>
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
                <Button className={saving?'bg-gray-500 hover:bg-gray-500':''} variant='default' onClick={handleFileUpload}>
                  {saving?'Saving':'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Profile;
