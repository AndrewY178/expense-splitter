import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-lg font-bold text-gray-900 dark:text-white"
        >
          Expense Splitter
        </button>
        <button
          onClick={logout}
          className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}


