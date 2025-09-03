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
