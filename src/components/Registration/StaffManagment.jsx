import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import staffIcon from '/staff.svg';
import plus from '/tabler_plus.svg';
import lineIcon from '/Line.svg';

function StaffManagement({ onNext, onBack, updateFormData, initialData }) {
  const [departments, setDepartments] = useState(['', '', '']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData.department_names && initialData.department_names.length > 0) {
      setDepartments(initialData.department_names);
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
    const departmentData = {
      department_names: departments,
      number_of_departments: departments.length
    };
    updateFormData(departmentData); 
    onNext();
  };

  return (
    <section className="min-h-screen bg-white flex items-center overflow-hidden justify-center">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-24 ml-20">
      <div className="flex lg:hidden gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 2 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        

        <div className="lg:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-8">
          <img
            src={staffIcon}
            alt="staff"
            className="h-[96] mb-4 text-[#5663AC]"
          />
          <h2 className="text-[24px] font-[500] font-Montserrat">
            Staff Management
          </h2>
          <p className="font-sans font-[400] text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="space-y-7  relative ">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[600] lg:block hidden">Staff Management</h1>
          </div>
          <div className="flex justify-between lg:w-[570px] w-[380px] m-auto">
            <label htmlFor="hotel-name" className="block text-sm font-sans font-[600] text-neutral-950">
              Departments
            </label>
            <button type="button" onClick={handleAddDepartment}>
              <img src={plus} alt="Add department" />
            </button>
          </div>
          <div className="h-48 overflow-y-auto">
            {departments.map((department, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <input
                  type="text"
                  className="h-8 w-[380px] m-auto py-2 px-4 border text-xs border-[#BDBDBD] rounded-[4px] focus:outline-none lg:w-full"
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
          <div className='h-2'>
          {error && <p className="text-red-500 fixed">{error}</p>}
          </div>
          <div className='lg:relative top-[5.6rem] '>
            <button type="button" onClick={() => { updateFormData({ department_names: departments }); onBack(); }} className="h-9 w-[7rem] bg-gray-400 font-Montserrat font-[700] fixed rounded-lg  text-white">
              <span>Back </span>
            </button>
            <button onClick={handleNextClick} className="h-9 w-28 bg-[#5663AC] rounded-lg text-white font-[700] top-10 ml-[19rem] lg:ml-[32rem]">
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
        </form>
        <div>
          <div className="hidden lg:block lg:w-[512px] font-medium relative left-[13%] lg:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
          <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 3
                      ? "border-[#5C69F8] text-black"
                      : "text-black bg-white border-none"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <img className="relative hidden lg:block top-36 left-[43.7%]" src={lineIcon} alt="" />
            <img className="relative hidden lg:block top-[80%] left-[43.7%]" src={lineIcon} alt="" />
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src={staffIcon}
                alt="Hotel Icon"
                className="h-24 mb-4 text-[#5663AC]"
              />
              <h2 className="text-2xl font-medium">Staff Management</h2>
              <p className="font-[400] text-[14px] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-[400] text-[14px]">You can always edit the data in the</span>
                <br />
                <span className="font-[400] text-[14px]">setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StaffManagement;