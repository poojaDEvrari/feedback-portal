import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';  // Assume you have these utility functions for notifications
import { motion } from 'framer-motion';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
    
        if (!email || !password) {
            return handleError('Email and password are required.');
        }
    
        try {
            const url = 'http://localhost:5000/auth/login'; // Ensure the URL is correct
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });
    
            const result = await response.json();
            const { success, message, jwtToken, name, role } = result;
    
            if (success) {
                handleSuccess(message);
    
                // Save token and user data in localStorage
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('role', role); // Save the user's role
    
                setTimeout(() => {
                    // Redirect based on the user's role
                    if (role === 'admin') {
                        navigate('/admin-dashboard');
                    } else if (role === 'user') {
                        navigate('/user-dashboard');
                    } else {
                        navigate('/home'); // Default redirect for undefined roles
                    }
                }, 1000);
            } else {
                handleError(message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            handleError(err.message || 'An unexpected error occurred.');
        }
    };
    

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={loginInfo.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring focus:ring-indigo-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring focus:ring-indigo-300"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:underline">
                        Signup
                    </Link>
                </p>
            </div>
            <ToastContainer />
        </motion.div>
    );
}

export default Login;
