import React from 'react'
import { Link } from 'react-router-dom';

function NotFound() {
   return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops! Page not found.</p>
      <p className="text-md text-gray-500 mt-2 text-center max-w-md">
        The page you're looking for doesn’t exist. 
        Try going back to the homepage.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound