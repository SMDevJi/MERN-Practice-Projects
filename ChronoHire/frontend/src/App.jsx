import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOtp from './pages/VerifyOtp'
import About from './pages/About'
import Purchases from './pages/Purchases'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import InterViewDetails from './pages/InterViewDetails'
import ConductInterview from './pages/ConductInterview'
import ShowEvaluation from './pages/ShowEvaluation'
import PaymentCancelled from './pages/PaymentCancelled'
import PaymentSuccess from './pages/PaymentSuccess'



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element=<Layout />>
        <Route path='' element=<Home /> />
        <Route path='signup' element=<Signup /> />
        <Route path='login' element=<Login /> />
        <Route path='verify-otp' element=<VerifyOtp /> />
        <Route path='about' element=<About /> />
        <Route path='purchases' element=<Purchases /> />
        <Route path='dashboard' element=<Dashboard /> />
        <Route path='profile' element=<Profile /> />
        <Route path='interview-details/:interviewId' element=<InterViewDetails /> />
        <Route path='conduct-interview/:interviewId' element=<ConductInterview /> />
        <Route path='show-evaluation/:interviewId' element=<ShowEvaluation /> />
        <Route path='payment-cancelled' element=<PaymentCancelled /> />
        <Route path='payment-success' element=<PaymentSuccess /> />
        <Route path='*' element=<NotFound /> />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
