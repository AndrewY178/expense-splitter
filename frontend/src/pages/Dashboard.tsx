import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { a } from "vitest/dist/chunks/suite.B2jumIFP.js";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Group {
    id: number;
    name: string;
    members: User[];
}

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [groups, setGroups] = useState<Group[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect( () => {
        const fetchData = async () => {
            try {
                const userResponse = await api.get('/users/me');
                setUser(userResponse.data);

                const groupResponse = await api.get('/groups');
                setGroups(groupResponse.data);
            } catch (error) {
                console.error('Error loading dashboard:', error);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/groups', { name: newGroupName });
            alert('Group "${response.data.name}" created successfully!');

            setGroups([...groups, response.data]);

            setIsModalOpen(false);
            setNewGroupName('');
        } catch (error) {
            console.error('Error creating group:', error);
        }

    }

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    if(loading) {
        return <div className="p-10">Loading profile...</div>;
    }
    return (
        <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900 dark:text-white">
            
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Hello, <span className="text-blue-600">{user?.name}</span>!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <button 
                        onClick={logout}
                        className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Placeholder */}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Groups */}
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 transition-colors duration-200">
                    <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Your Groups</h2>
                    
                    {groups.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">You haven't joined any groups yet.</p>
                    ) : (
                        <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                            {groups.map(group => (
                                <li 
                                    key={group.id}
                                    className = "flex justify-between items-center p-3 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                                >
                                    <span className="font-medium">{group.name}</span>
                                    {/* Placeholder for Member Count if available */}
                                    <span className="text-xs text-gray-500 dark:text-gray-300">
                                        #{group.id}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 w-full rounded bg-blue-100 py-2 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                        >
                        + Create a Group
                        </button>
                    </div>

                    {/* Activities */}
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 transition-colors duration-200">
                        <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
                        <p className="text-gray-500 dark:text-gray-400">No recent expenses to show.</p>
                    </div>
                </div>
            </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 transition-colors duration-200">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create New Group</h3>
            
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Weekend Trip"
                  className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;