import React from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';

const Dashboard = () => {
    return (
        <div className="flex min-w-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 p-6">
                <AdminNavbar />
                <div className="mt-6">
                    <h2 className="text-3xl font-bold">Dashboard</h2>
                    <p className="mt-2 text-gray-600">Welcome to the admin dashboard!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
