import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { QRCodeCanvas } from "qrcode.react";

const Tokens = () => {
    const [token, setToken] = useState('');
    const [status, setStatus] = useState('Unused');
    const [tokens, setTokens] = useState([]);

    const generateToken = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let newToken = '';
        for (let i = 0; i < 10; i++) {
            newToken += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setToken(newToken);
        setStatus('Unused');
        setTokens([...tokens, { id: Date.now(), token: newToken, status: 'Unused' }]);
    };

    const markAsUsed = (id) => {
        setTokens(tokens.map(t => t.id === id ? { ...t, status: 'Used' } : t));
    };

    return (
        <div className="flex min-w-screen bg-gray-100">
            <AdminSidebar />
            <div className="p-4 w-full">
                <h1 className="text-2xl font-bold mb-4">Generated Token</h1>
                <button onClick={generateToken} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Generate Token</button>
                {token && (
                    <div className="mb-4">
                        <p>Generated Token: {token}</p>
                        <QRCode value={token} size={150} />
                    </div>
                )}
                <h2 className="text-xl font-semibold mt-4">Tokens List</h2>
                <ul className="mt-2">
                    {tokens.map((item) => (
                        <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded mb-2 shadow">
                            <span>{item.token}</span>
                            <span className={`text-sm ${item.status === 'Used' ? 'text-red-500' : 'text-green-500'}`}>{item.status}</span>
                            {item.status === 'Unused' && (
                                <button onClick={() => markAsUsed(item.id)} className="bg-gray-200 text-sm px-2 py-1 rounded">Mark as Used</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tokens;
