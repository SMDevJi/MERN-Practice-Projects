import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ product }) => {
  return (
    <div className="rounded-lg shadow-md bg-white transition-transform duration-300 hover:scale-105 flex flex-col h-full">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-1">{product.title}</h2>
        <p className="text-gray-600 mb-4">Tutor: {product.tutor}</p>

        <div className="mt-auto">
          <Link to={`/course-details/${product.id}`}>
            <button
              className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
