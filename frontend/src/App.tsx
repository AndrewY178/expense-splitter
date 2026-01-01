import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/*
const Dashboard = () =>{
  const logout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!'); //remove later
    window.location.href = '/';
  };
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-600">Welcome to the Dashboard!</h1>
      <p className="mt-4">You are securely logged in.</p>
      <button 
        onClick={logout}
        className="mt-6 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};
*/

const PrivateRoute = ({ children } : {children: JSX.Element}) => {
  const token = localStorage.getItem('token');
  return token ? children : <Login/>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div className="p-10 text-center">Register Page Coming Soon!</div>} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;