import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(`Login dengan email: ${email} dan password: ${password}`);
    };

    return (
        <div className="flex justify-center items-center min-w-screen min-h-screen bg-gradient-to-r from-gray-100 to-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
                <form className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                    <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                >
                    Login
                </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
