import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-purple-600 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        
        <div className="text-2xl font-bold mb-4 md:mb-0">
          <Link to='/'>LMS</Link>
        </div>

        
        <ul className="flex space-x-6 mb-4 md:mb-0">
          <li>
            <Link to="" className="hover:text-white transition">Home</Link>
          </li>
          <li>
            <Link to="/feedback" className="hover:text-white transition">Feedback</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-white transition">About</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
          </li>
        </ul>

        
        <div className="flex space-x-4 text-lg">
          <Link to="#" className="hover:text-white transition">
            <FaFacebookF />
          </Link>
          <Link to="#" className="hover:text-white transition">
            <FaTwitter />
          </Link>
          <Link to="#" className="hover:text-white transition">
            <FaInstagram />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-white mt-6">
        &copy; 2025 LMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
