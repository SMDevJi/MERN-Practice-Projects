import { useState } from 'react'
import './App.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import Layout from './Layout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';



function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element=<Layout />>
        <Route path='' element=<Home /> />
        <Route path='signup' element=<Signup /> />
        <Route path='login' element=<Login /> />
      </Route>
    )
  )
  return (
    <>
      <RouterProvider router={router}>

      </RouterProvider>
    </>
  )
}

export default App
