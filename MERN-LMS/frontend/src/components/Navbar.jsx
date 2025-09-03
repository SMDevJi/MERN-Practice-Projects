import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Drawer from './Drawer'
import { FaGraduationCap } from 'react-icons/fa'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { remove } from '../redux/userSlice'
import { jwtDecode } from 'jwt-decode'

function Navbar() {
  const dispatch = useDispatch()
  const [isScrolled, setIsScrolled] = useState(false)

  const authorization = useSelector((state) => state.user.authorization)
  //console.log(authorization)

  let decoded;
  if (authorization !== '') {
    decoded = jwtDecode(authorization)
    //console.log(decoded)
  }

  const handleLogout = () => {
    dispatch(remove())
    localStorage.removeItem('authorization')
  }


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <header className={`z-20 sticky top-0 w-full flex justify-center ${isScrolled ? 'bg-white' : 'bg-gray-900'}`}>
      <nav className="w-full max-w-[1200px] navbar flex sm:flex-row flex-col justify-between items-start sm:items-center text-2xl p-5 h-[70px] text-white font-bold ">
        <div className={`title ${isScrolled ? 'invert' : ''}`}>
          <Link to="/" className='flex items-center gap-2'>
            <FaGraduationCap size={40} />
            <p>LMS</p>
          </Link>
        </div>
        <div className={`${isScrolled ? 'text-violet-900' : 'text-violet-300'} links text-sm h-full sm:flex hidden items-center`}>
          <ul className='flex gap-4'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/feedback'>Feedback</Link></li>
            <li><Link to='/about'>About</Link></li>
            <li><Link to='/contact'>Contact Us</Link></li>
          </ul>
        </div>
        <div className="account sm:flex hidden items-center">

          {authorization == '' ?
            <>
              <button
                className={`text-base  ${isScrolled ? 'bg-white text-purple-600 hover:text-purple-400 shadow-sm shadow-purple-400' : 'bg-purple-600 hover:bg-purple-700'} font-medium  p-2 px-4 rounded-md mx-3`}
              >
                <Link to='/login'>Login</Link>
              </button>
            </>
            :
            <>
              <button
                className={`text-base  ${isScrolled ? 'bg-white text-purple-600 hover:text-purple-400 shadow-sm shadow-purple-400' : 'bg-purple-600 hover:bg-purple-700'} font-medium  p-2 px-4 rounded-md mx-3`}
              >
                <Link to='/profile'>Profile</Link>
              </button>
              <button
                onClick={handleLogout}
                className={`text-base  ${isScrolled ? 'bg-white text-purple-600 hover:text-purple-400 shadow-sm shadow-purple-400' : 'bg-purple-600 hover:bg-purple-700'} font-medium  p-2 px-4 rounded-md mx-3`}
              >
                Logout
              </button>
            </>

          }


        </div>
        <div className=" small-dd sm:hidden block">
          <Drawer authorization={authorization} handleLogout={handleLogout}/>
        </div>
      </nav>
    </header>
  )
}

export default Navbar