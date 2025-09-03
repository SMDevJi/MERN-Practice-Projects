import React from 'react';

const CourseCard = ({product}) => {
  return (
    <div className=" rounded-lg shadow-md bg-white transition-transform duration-300 hover:scale-105">
      <img src={product.image} alt={product.title} className="w-full h-48 " />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1">{product.title}</h2>
        <p className="text-gray-600 mb-4">Tutor: {product.tutor}</p>

        <button
          className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
