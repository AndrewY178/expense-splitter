import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface User {
    id: string;
    name: string;
    email: string;
}

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect( () => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('Session expired. Please log in again.'); //remove later
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        alert('Logged out successfully!'); //remove later
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
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold">Your Groups</h2>
                        <p className="text-gray-500">You haven't joined any groups yet.</p>
                        <button className="mt-4 w-full rounded bg-blue-100 py-2 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                        + Create a Group
                        </button>
                    </div>

                    {/* Activities */}
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold">Recent Activity</h2>
                        <p className="text-gray-500">No recent expenses.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;