import { useState, useEffect } from "react";
import * as React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
// import { BarChart } from '@mui/x-charts';


const Dash = () => {
  const departments = [
    { value: '', label: 'Select Department', disabled: true },
    { value: 'security', label: 'Security' },
    { value: 'housekeeping', label: 'HouseKeeping' },
  ];
  
  const [selected, setSelected] = useState(departments[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (dept) => {
    setSelected(dept);
    setIsDropdownOpen(false);
  };
  

  return (
    <section>
      <h2 className="text-[#252941] text-2xl font-semibold">Dashboard</h2>
      <div className="p-3 flex flex-row gap-5">
        <div className="bg-white w-[70%] h-[50%] pt-4 pb-4 pr-6 pl-6 rounded-lg">
          <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Hotel Status</h2>

        </div>
        <div className="bg-white w-[30%] h-[50%] p-4 rounded-xl pr-6 pl-6">
          <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Task Assignment</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Task Title"
              className=" border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
            />
            {/* <select
              type="text"
              placeholder="Department"
              className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none "
            >
              <option value="" disabled>Select Department</option>
              <option value="security">Security</option>
              <option value="housekeeping">HouseKeeping</option>
            </select> */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selected.value ? 'text-black' : 'text-gray-400'} focus:outline-none flex justify-between items-center`}
              >
                {selected.label}
                {isDropdownOpen ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                  {departments.map((dept, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelect(dept)}
                      disabled={dept.disabled}
                      className={`w-full text-left px-4 py-2 ${dept.disabled ? 'text-gray-400 cursor-default' : 'text-black hover:bg-gray-100'}`}
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <textarea
              name="taskDescription"
              id="taskDescription"
              placeholder="Task Description"
              maxLength={350}
              className="border border-gray-200 w-full rounded-xl bg-[#e6eef9] p-2 h-[150px] resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
            ></textarea>
            <div className="flex justify-end">
              <button
                // onClick={handleAssign} 
                className="h-9 w-28 lg:w-full  bg-[#252941] font-Montserrat font-bold rounded-lg text-white"
              >
                Assign
              </button>
            </div>
          </form>
        </div>

      </div>

    </section>
  )
}

export default Dash;