import React from 'react'
import { useNavigate } from 'react-router-dom'

function IncompleteRegisteration() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup/hoteldetails', { replace: true });
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Please complete your hotel registration
        </p>
        <button 
          onClick={handleClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Complete Registration
        </button>
      </div>
    </div>
  )
}

export default IncompleteRegisteration
