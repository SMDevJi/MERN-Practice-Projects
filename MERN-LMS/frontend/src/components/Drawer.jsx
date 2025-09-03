import React, { useState } from 'react';
import DropOn from '../assets/dropdown-on.svg'; // Your SVG icon
import { Link } from 'react-router-dom';

export default function Drawer({ authorization,handleLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 p-2"
            >
                <img
                    src={DropOn}
                    alt="Toggle Drawer"
                    className={`cursor-pointer h-9 w-9 transition duration-300`}
                />
            </button>


            <div
                className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-blue-300 z-40 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="ml-3 p-3 mt-20 font-medium text-xl">
                    <Link to="/">Home</Link>
                </div>
                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/feedback">Feedback</Link>
                </div>
                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/about">About</Link>
                </div>
                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/contact">Contact</Link>
                </div>
                {authorization == '' ?
                    <>
                        <button
                            className="mt-3 ml-6 text-base text-black font-medium bg-white hover:bg-gray-200 p-2 px-4 rounded-md"
                        >
                            <Link to='/login'>Login</Link>
                        </button>
                    </>
                    :
                    <>
                        <button
                            className="mt-3 ml-6 text-base text-black font-medium bg-white hover:bg-gray-200 p-2 px-4 rounded-md"
                        >
                            <Link to='/profile'>Profile</Link>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="mt-3 ml-6 text-base text-black font-medium bg-white hover:bg-gray-200 p-2 px-4 rounded-md"
                        >
                            Logout
                        </button>
                    </>

                }
            </div>
        </div>
    );
}
