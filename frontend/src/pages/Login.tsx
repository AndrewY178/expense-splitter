import {useState} from 'react';
import {useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Call the backend login endpoint
            const response = await api.post('/auth/login', {email, password});

            // Save the token to localStorage
            const {accessToken} = response.data;
            localStorage.setItem('token', accessToken);

            //Redirect to dashboard
            alert('Login successful!'); //remove later
            navigate('/dashboard');
        }
        catch (err : any) {
            setError(err.response?.status === 401 
                ? "Invalid email or password." 
                : "Something went wrong. Is the backend running?");
            console.error('Login error:', err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800 transition-colors duration-200">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
              Sign In
            </h2>
            
            {error && (
              <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-100">
                {error}
              </div>
            )}
    
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
    
              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Log In
              </button>
            </form>
            
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                Register
              </Link>
            </p>
          </div>
        </div>
      );
    };
    
    export default Login;