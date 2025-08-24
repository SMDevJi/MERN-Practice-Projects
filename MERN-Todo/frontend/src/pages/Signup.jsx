import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import {  useNavigate} from "react-router-dom";

// import dotenv from 'dotenv';
// dotenv.config();


function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')
  const [registerErr,setRegisterErr]=useState('')
  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const options = {
      method: 'POST',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
      data: {
        name: e.target['name'].value,
        email: e.target['email'].value,
        password: e.target['password'].value,
        confirmPassword: e.target['confirm-password'].value
      }
    };

    axios.request(options).then(function (response) {
      if(!response.data.success){
        setRegisterErr(response.data.message)
      }else{
        navigate('/login')
      }
      console.log(response.data);
    }).catch(function (error) {
      try{
        setRegisterErr(error.response.data.message)
      }
      catch{
        setRegisterErr(error.message)
      }
      console.error(error.message);
    });

    //console.log()
  }


  return (
    <>
      <div className='h-screen flex justify-center items-center bg-gray-100'>
        <form className='p-10 space-y-6 bg-white rounded-lg shadow-lg max-w-md w-full' method="POST" onSubmit={handleSubmit}>
          <h1 className='text-3xl justify-self-start font-bold text-center text-gray-800'>Sign Up</h1>

          <div className="field-container space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="field-container space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="field-container space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='on'
              id="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="field-container space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              autoComplete='on'
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 "
          >
            Sign Up
          </button>
          <p className='text-center'>
            <span className='text-red-500'>{registerErr}</span><br/>
            Already have an account? <Link to='/login' className='font-bold'>Login</Link>
          </p>
        </form>
      </div>
    </>
  )
}

export default Signup;
