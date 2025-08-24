import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { remove } from '../redux/userSlice'


function Navbar({ query, setQuery }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const authorization = user.authorization
  let decoded;
  if (authorization !== '') {
    decoded = jwtDecode(authorization)
  }
  

  const handleLogout = () => {
    dispatch(remove())
    localStorage.removeItem('authorization')
  }

  return (
    <header>
      <nav className="navbar flex justify-between items-center text-2xl p-4 h-[80px] text-white font-bold bg-gray-800">
        <div className="title">
          <Link to="#">TodoApp</Link>
        </div>
        <div className="search text-md h-full flex items-center">
          <input
            className="rounded-md h-[85%] w-full bg-gray-600 text-base font-normal px-3 py-2 focus:outline-0"
            type="text"
            id="userInput"
            name="userInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search todos..."
          />
        </div>
        <div className="account flex items-center">
          {authorization == '' ?
            <>
              <button
                className="text-base font-medium bg-blue-500 hover:bg-blue-600 p-2 px-4 rounded-md mx-3"
              >
                <Link to='/login'>Login</Link>
              </button>
              <button
                className="text-base font-medium bg-green-500 hover:bg-green-600 p-2 px-4 rounded-md mx-1"
              >
                <Link to='/signup'>Sign Up</Link>
              </button>
            </>
            :
            <>
              <p className='mx-3 text-base font-medium'>
                {decoded.name}
              </p>
              <button
                onClick={handleLogout}
                className="cursor-pointer text-base font-medium bg-red-500 hover:bg-red-600 p-2 px-4 rounded-md mx-1"
              >
                Logout
              </button>
            </>}

        </div>
      </nav>
    </header>
  )
}

export default Navbar
