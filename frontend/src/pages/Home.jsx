import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from './Navbar.jsx';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  // Check if the current route is exactly `/home`
  const isHomePage = location.pathname === '/home';

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-500 to-indigo-900 text-white">
      {/* Navbar */}
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

      {/* Show Hero Section only on the `/home` route */}
      {isHomePage && (
        <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome, {loggedInUser || 'Guest'}! 
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Explore your personalized dashboard with ease. Dive into the world of
            endless possibilities tailored just for you.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold shadow-lg transition duration-300"
              onClick={() => navigate('/home/feedback')}
            >
              Get Started
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-md font-semibold shadow-lg transition duration-300"
              onClick={() => navigate('/home/about')}
            >
              Learn More
            </button>
          </motion.div>
        </div>
      )}

      {/* Render child routes */}
      <Outlet />

      {/* ToastContainer */}
      <ToastContainer />
    </div>
  );
}

export default Home;
