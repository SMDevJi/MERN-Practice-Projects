import { useState } from 'react'
import './App.css'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import Feedback from './pages/Feedback'
import About from './pages/About'
import Contact from './pages/Contact'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CreateCourse from './pages/CreateCourse'
import CourseOrders from './pages/CourseOrders'
import Dashboard from './pages/Dashboard'
import AllCourses from './pages/AllCourses'
import CourseDetails from './pages/CourseDetails'
import AddLecture from './pages/AddLecture'
import PaymentSuccess from './pages/PaymentSuccess'
import WatchCourse from './pages/WatchCourse'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element=<Layout />>
        <Route path='' element=<Home /> />
        <Route path='feedback' element=<Feedback /> />
        <Route path='about' element=<About /> />
        <Route path='contact' element=<Contact /> />
        <Route path='signup' element=<Signup /> />
        <Route path='login' element=<Login /> />
        <Route path='profile' element=<Profile /> />
        <Route path='create-course' element=<CreateCourse /> />
        <Route path='course-orders' element=<CourseOrders /> />
        <Route path='dashboard' element=<Dashboard /> />
        <Route path='all-courses' element=<AllCourses /> />
        <Route path='course-details/:courseId' element=<CourseDetails /> />
        <Route path='add-lecture/:courseId' element=<AddLecture /> />
        <Route path='payment-success/:courseId' element=<PaymentSuccess /> />
        <Route path='watch-course/:courseId' element=<WatchCourse /> />
      </Route>
    )
  )
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
