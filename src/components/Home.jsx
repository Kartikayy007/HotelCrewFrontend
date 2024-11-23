import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('rememberMe');
    navigate('/login');
  };

  return (

    <><div className="min-h-screen bg-white flex flex-col items-center">
      <header className="w-full bg-[#5663AC] text-white py-4 flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">{role} Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>
      <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">
          <span className="typewriter">Welcome, {userEmail}</span>
        </h2>
      </div>
    </div>
    </>
  );
};

export default Home;