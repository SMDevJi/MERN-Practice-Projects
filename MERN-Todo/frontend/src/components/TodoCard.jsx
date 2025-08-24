import React from 'react'
import deleteLogo from '../assets/delete.png';
import editLogo from '../assets/edit.png';

function TodoCard({ title, description, deleteTodo,toggleIntoEditMode}) {
    
    
    return (
        <div className='bg-white p-5'>
            <h1 className='font-bold'>{title}</h1>
            <p>
                {description}
            </p>
            <div className='flex justify-end items-center h-5 p-2'>
                <img onClick={toggleIntoEditMode} className='cursor-pointer mx-1 h-[20px] w-[20px]' src={editLogo} alt="edit" />
                <img onClick={deleteTodo} className='cursor-pointer mx-1 h-[15px] w-[15px]' src={deleteLogo} alt="delete" />
            </div>
        </div>
    )
}

export default TodoCard