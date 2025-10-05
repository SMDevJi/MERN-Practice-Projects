import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Drawer from './Drawer'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { remove, setCoins } from '../redux/userSlice'
import { jwtDecode } from 'jwt-decode'
import { Toaster } from 'sonner'
import { isJwtExpired } from '@/utils/utilities'


function Navbar() {
    const dispatch = useDispatch()
    const location = useLocation()
    const authorization = useSelector((state) => state.user.authorization)
    const coinBalance = useSelector((state) => state.user.coins)
    //console.log(authorization)

    const handleLogout = () => {
        dispatch(remove())
        localStorage.removeItem('authorization')
    }

    let decoded;
    if (authorization !== '') {
        if (isJwtExpired(authorization)) {
            handleLogout()
        }
        decoded = jwtDecode(authorization)
        
        //console.log(decoded)
    }




    const getLinkClass = (path) => {
        return location.pathname === path
            ? 'text-purple-600 font-bold ' // Active link style
            : 'hover:text-purple-600'
    }


    return (

        <header className='z-20 sticky top-0 w-full flex justify-center bg-black px-5 sm:px-10'>
            <nav className="w-full navbar flex sm:flex-row flex-col justify-between items-start sm:items-center text-2xl py-3 h-[70px] text-white font-bold ">
                <div className=''>
                    <Link to="/" className='flex items-center gap-2 h-15 w-15'>
                        <img src="/logo.png" alt="Logo" />
                    </Link>
                </div>
                <div className='font-bold text-gray-400 links text-sm h-full sm:flex hidden items-center'>
                    <ul className='gap-3 flex'>
                        <li><Link to='/dashboard' className={getLinkClass('/dashboard')}>Dashboard</Link></li>
                        <li><Link to='/purchases' className={getLinkClass('/purchases')}>Purchases</Link></li>
                        <li><Link to='/about' className={getLinkClass('/about')}>About</Link></li>
                    </ul>


                </div>
                <div className="account sm:flex hidden items-center">

                    {authorization == '' ?
                        <>
                            <Link to='/login'>
                                <button
                                    className='cursor-pointer text-base bg-purple-600 hover:bg-purple-700 font-medium  p-2 px-4 rounded-md mx-3'
                                >
                                    Login
                                </button>
                            </Link>
                        </>
                        :
                        <>
                            <Link to='/purchases' className='mr-2'>
                                <div className="coins w-10 h-12 cursor-pointer flex flex-col justify-center items-center">
                                    <img className=' rounded-full w-6 h-6 border-1' src='/coin.png' alt="Profile" />
                                    <p className='text-yellow-300 stroke text-lg leading-none'>{coinBalance}</p>
                                </div>
                            </Link>

                            <Link to='/profile'>
                                <div className="profile w-12 h-12 ">
                                    <img className='rounded-full border border-black' src={decoded?.picture || '/default-profile.png'} alt="Profile" />
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='cursor-pointer text-base  bg-purple-600 hover:bg-purple-700 font-medium  p-2  rounded-md mx-3'
                            >
                                Logout
                            </button>
                        </>

                    }


                </div>
                <div className=" small-dd sm:hidden block">
                    <Drawer authorization={authorization} handleLogout={handleLogout} decoded={decoded} coinBalance={coinBalance}/>
                </div>
            </nav>
            <Toaster />
        </header>
    )
}

export default Navbar