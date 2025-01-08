// src/pages/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function Navbar({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    // handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Client Feedback Management Portal</div>
      <div className="flex space-x-4">
        <NavLink 
          to="/home" 
          className={({ isActive }) => (isActive ? 'font-bold text-gray-300' : 'hover:text-gray-300')}
        >
          Home
        </NavLink>
        <NavLink 
          to="/home/feedback" 
          className={({ isActive }) => (isActive ? 'font-bold text-gray-300' : 'hover:text-gray-300')}
        >
          Feedback Form
        </NavLink>
        <NavLink 
          to="/home/dashboard" 
          className={({ isActive }) => (isActive ? 'font-bold text-gray-300' : 'hover:text-gray-300')}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/home/about" 
          className={({ isActive }) => (isActive ? 'font-bold text-gray-300' : 'hover:text-gray-300')}
        >
          About Us
        </NavLink>
        <NavLink 
          to="/home/contact" 
          className={({ isActive }) => (isActive ? 'font-bold text-gray-300' : 'hover:text-gray-300')}
        >
          Contact Us
        </NavLink>
        <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
        <ToastContainer />
      </div>
    </nav>
  );
}

export default Navbar;
