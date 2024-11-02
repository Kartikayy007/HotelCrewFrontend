import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

function StaffManagement({ onNext, onBack, updateFormData, initialData }) {
  const [departments, setDepartments] = useState(initialData.departments || ['Housekeeping', 'Security']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData.departments) {
      setDepartments(initialData.departments);
    }
  }, [initialData]);

  const handleAddDepartment = () => {
    setDepartments([...departments, '']);
  };

  const handleDepartmentChange = (index, value) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    setDepartments(newDepartments);
  };

  const handleDeleteDepartment = (index) => {
    const newDepartments = departments.filter((_, i) => i !== index);
    setDepartments(newDepartments);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (departments.some(department => department === '')) {
      setError('Please fill out all required fields.');
      return;
    }
    updateFormData({ departments });
    onNext();
  };

  return (
    <section className="min-h-screen bg-white flex items-center overflow-hidden">
      <div className="flex justify-center items-center gap-9 ml-20">
        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium">Staff Management</h1>
          </div>
          <div className="flex justify-between">
            <label htmlFor="hotel-name" className="block text-sm font-sans font-medium">
              Departments
            </label>
            <button type="button" onClick={handleAddDepartment}>
              <img src="src/assets/tabler_plus.svg" alt="Add department" />
            </button>
          </div>
          <div className="h-48 overflow-y-auto">
            {departments.map((department, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <input
                  type="text"
                  className="h-8 w-full py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
                  placeholder={`Department ${index + 1}`}
                  value={department}
                  onChange={(e) => handleDepartmentChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteDepartment(index)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Delete department"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div> 
          
          {error && <p className="text-red-500 fixed">{error}</p>}

          <div className='relative top-[5.6rem] '>
            <button type="button" onClick={onBack} className="h-9 w-[7rem] bg-gray-400 font-Montserrat font-[700] fixed rounded-lg  text-white">
              <span>Back </span>
            </button>
            <button onClick={handleNextClick} className="h-9 w-28 bg-[#5663AC] rounded-lg text-white font-[700] top-10 ml-[32rem]">
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
        </form>
        <div>
          <div className="w-[515px] relative left-[35%] h-screen bg-white shadow-2xl border-none rounded-lg overflow-hidden">
            <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 3 ? 'border-[#5C69F8] text-black' : 'text-black bg-white'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <img className="relative top-36 left-[43.7%]" src="src/assets/Line.svg" alt="" />
            <img className="relative top-[80%] left-[43.7%]" src="src/assets/Line.svg" alt="" />
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src="src/assets/staff.svg"
                alt="Hotel Icon"
                className="h-24 mb-4 text-[#5663AC]"
              />
              <h2 className="text-2xl font-medium">Staff Management</h2>
              <p className="text-gray-600 font-light text-center">
                Fill out the form on the left.
                <br />
                <span className="font-light">You can always edit the data in the</span>
                <br />
                <span className="font-light">setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StaffManagement;