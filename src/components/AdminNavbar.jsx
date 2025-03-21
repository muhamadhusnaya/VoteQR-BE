import React from 'react';

const AdminNavbar = () => {
    return (
        <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
            {/* Logo */}
            <div className="text-2xl font-bold text-blue-600">
                QRVote Admin
            </div>
            
            {/* Search Box */}
            <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none w-64 text-gray-700"
                />
                <button className="text-gray-500 ml-2">
                🔍
                </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
                <div className="text-gray-700">Admin</div>
                <img
                src="https://png.pngtree.com/element_our/20190531/ourmid/pngtree-vector-cartoon-curly-beauty-image_1320767.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full"
                />
            </div>
        </div>
    );
};

export default AdminNavbar;
