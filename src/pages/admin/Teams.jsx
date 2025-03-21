import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);

    const handleAddTeam = () => {
        if (name && category && image) {
            const newTeam = { id: Date.now(), name, category, image };
            setTeams([...teams, newTeam]);
            setName('');
            setCategory('');
            setImage(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">CRUD Team</h1>
                <div className="grid grid-cols-2 gap-8">
                    {/* List Teams */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Team List</h2>
                        {teams.length === 0 ? (
                            <p>No teams available.</p>
                        ) : (
                            <ul>
                                {teams.map((team) => (
                                    <li key={team.id} className="p-2 mb-2 bg-gray-50 rounded-lg flex items-center justify-between">
                                        <span>{team.name} - {team.category}</span>
                                        <img src={URL.createObjectURL(team.image)} alt={team.name} className="w-12 h-12 object-cover rounded-md" />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Form Add Team */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Add Team</h2>
                        <input
                            type="text"
                            placeholder="Team Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select Category</option>
                            <option value="Software">Software</option>
                            <option value="Hardware">Hardware</option>
                        </select>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={handleAddTeam}
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        >
                            Add Team
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Teams;
