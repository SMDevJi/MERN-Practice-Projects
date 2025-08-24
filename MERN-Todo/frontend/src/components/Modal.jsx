import React, { useState, useEffect } from "react";

export default function Modal({ toggleModal, isEditMode, preEditTodo, addTodo, editTodo }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    console.log(preEditTodo)

    useEffect(() => {
        if (isEditMode && preEditTodo) {
            setTitle(preEditTodo.title);
            setDescription(preEditTodo.description);
        }
    }, [isEditMode, preEditTodo]);


    return (
        <>


            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/80"
                ></div>

                {/* Modal content */}
                <div className="relative z-10 bg-gray-100 p-7 rounded max-w-lg w-[90%] text-gray-900">
                    <h2 className="text-2xl font-semibold ">{isEditMode ? 'Edit Todo' : 'Add New Todo'}</h2>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="title"
                        name="title"
                        placeholder="Note Title"
                        required
                        className="my-3 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        name="description"
                        placeholder="Note Description"
                        required
                        className="my-3 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        rows={4}
                    />

                    <button
                        onClick={isEditMode ?
                            (() => editTodo(title,description)) :
                            (() => addTodo(title, description))}
                        className="my-1 text-sm px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        {isEditMode ? 'Edit Todo' : 'Add Todo'}
                    </button>
                    <button
                        onClick={toggleModal}
                        className="my-1 mx-2 text-sm px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>


        </>
    );
}
