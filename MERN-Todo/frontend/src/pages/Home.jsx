import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { add, remove } from '../redux/userSlice'
import TodoCard from '../components/TodoCard'
import axios from "axios";
import Modal from '../components/Modal'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false);
  const [editNoteId, setEditNoteId] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [preEditTodo, setPreEditTodo]=useState({title:'',description:''})


  const logoutUser = () => {
    dispatch(remove())
    localStorage.removeItem('authorization')
  }


  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleIntoEditMode = (nid,title,description) => {
    setIsEditMode(true)
    setEditNoteId(nid)
    setPreEditTodo({title:title,description:description})
    toggleModal()
  }

  const toggleIntoAddMode = () => {
    setIsEditMode(false)
    setEditNoteId("")
    setPreEditTodo({})
    toggleModal()
  }


  const deleteTodo = (id) => {
    const options = {
      method: 'DELETE',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/note/delete/${id}`,
      headers: {
        Authorization: `Bearer ${user.authorization}`
      },
      data: {}
    };
    axios.request(options).then(function (response) {
      if (!response.data.success) {
        toast.error(response.data.message)
      } else {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id))
        toast.success('Todo deleted successfully.')
      }
      console.log(response.data);
    }).catch(function (error) {
      try {
        if (error.response.status = 401) {
          logoutUser()
          navigate('/login')
        } else {
          toast.error(error.response.data.message)
        }

      } catch {
        toast.error(error.message)
      }
    });
  }


  const addTodo = (newTitle, newDescription) => {
    const options = {
      method: 'POST',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/note/add`,
      headers: {
        Authorization: `Bearer ${user.authorization}`
      },
      data: { title: newTitle, description: newDescription }
    };

    axios.request(options).then(function (response) {
      if (!response.data.success) {
        toast.error(response.data.message)
      } else {
        fetchNotes()
        toggleModal()
        toast.success('Todo added successfully!')
      }
      console.log(response.data);
    }).catch(function (error) {
      try {
        if (error.response.status = 401) {
          logoutUser()
          navigate('/login')
        } else {
          toast.error(error.response.data.message)
        }

      } catch {
        toast.error(error.message)
      }
    });
  }


  const editTodo = (title,description) => {
    const options = {
      method: 'PUT',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/note/edit/${editNoteId}`,
      headers: { Authorization: `Bearer ${user.authorization}` },
      data: { title: title, description: description }
    };

    axios.request(options).then(function (response) {
      if (!response.data.success) {
        toast.error(response.data.message)
      } else {
        fetchNotes()
        toggleModal()
        toast.success('Todo edited successfully!')
      }
      console.log(response.data);
    }).catch(function (error) {
      try {
        if (error.response.status = 401) {
          logoutUser()
          navigate('/login')
        } else {
          toast.error(error.response.data.message)
        }

      } catch {
        toast.error(error.message)
      }
    });
  }



  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(query.toLowerCase()) ||
    todo.description.toLowerCase().includes(query.toLowerCase())
  )

  const authorization = localStorage.getItem('authorization')


  const fetchNotes = async () => {
    const options = {
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/note/getall`,
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    };

    axios.request(options)
      .then((response) => {
        if (!response.data.success) {
          setError(response.data.message)
        } else {
          setTodos(response.data.notes)
        }
      })
      .catch((error) => {
        try {
          if (error.response.status = 401) {
            logoutUser()
            navigate('/login')
          } else {
            setError(error.response.data.message)
          }

        } catch {
          setError(error.message)
        }
      })
      .finally(() => {
        setLoading(false)
      });
  }

  useEffect(() => {
    if (authorization) {
      dispatch(add(authorization))
      fetchNotes()
    } else {
      setLoading(false)
      setError("Login to view your Todos.")
      setTodos([])

    }
  }, [user, authorization])



  return (
    <div className='bg-gray-100 h-screen'>

      <Navbar query={query} setQuery={setQuery} />

      <div className='p-3 grid sm:grid-cols-3 gap-3'>
        {loading ? (
          <p className='font-bold'>Loading...</p>
        ) : error ? (
          <h1 className=' font-bold'>{error}</h1>
        ) : (
          filteredTodos.map(todo => (
            <TodoCard
              key={todo._id}
              title={todo.title}
              description={todo.description}
              deleteTodo={() => deleteTodo(todo._id)}
              toggleIntoEditMode={() => toggleIntoEditMode(todo._id,todo.title,todo.description)}
            />
          ))
        )}
      </div>
      {modal &&
        <Modal toggleModal={toggleModal} isEditMode={isEditMode} preEditTodo={preEditTodo} addTodo={addTodo} editTodo={editTodo} />
      }


      <button
        onClick={toggleIntoAddMode}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700"
        aria-label="Add"
      >
        +
      </button>
      <ToastContainer />
    </div>
  )
}

export default Home
