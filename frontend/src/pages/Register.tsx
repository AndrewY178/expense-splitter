import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/register', { name, email, password });

            navigate('/login');
        }
        catch (err : any) {
            const errorMessage = typeof err.response?.data === 'string' 
                ? err.response.data 
                : err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800 transition-colors duration-200">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
                Create Account
                </h2>
                
                {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-100">
                    {error}
                </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                    type="email"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input
                    type="password"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-green-600 py-2 text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                >
                    Register
                </button>
                </form>
                
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                    Log In
                </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;